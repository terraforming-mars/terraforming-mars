import * as prometheus from 'prom-client';
import {Clock} from '../../common/Timer';
import {paths} from '../../common/app/paths';
import {Request} from '../Request';
import {Response} from '../Response';
import {SessionId} from '../auth/Session';
import {GameLoader} from '../database/GameLoader';
import {ApiCloneableGame} from '../routes/ApiCloneableGame';
import {ApiCreateGame} from '../routes/ApiCreateGame';
import {ApiGame} from '../routes/ApiGame';
import {ApiGameHistory} from '../routes/ApiGameHistory';
import {ApiGameLogs} from '../routes/ApiGameLogs';
import {ApiGames} from '../routes/ApiGames';
import {ApiIPs} from '../routes/ApiIPs';
import {ApiLogout} from '../routes/ApiLogout';
import {ApiMetrics} from '../routes/ApiMetrics';
import {ApiPlayer} from '../routes/ApiPlayer';
import {ApiProfile} from '../routes/ApiProfile';
import {ApiSpectator} from '../routes/ApiSpectator';
import {ApiStats} from '../routes/ApiStats';
import {ApiWaitingFor} from '../routes/ApiWaitingFor';
import {Autopass} from '../routes/Autopass';
import {DiscordAuth} from '../routes/DiscordAuth';
import {GameHandler} from '../routes/Game';
import {GamesOverview} from '../routes/GamesOverview';
import {Context, IHandler} from '../routes/IHandler';
import {Load} from '../routes/Load';
import {LoadGame} from '../routes/LoadGame';
import {Login} from '../routes/Login';
import {PlayerInput} from '../routes/PlayerInput';
import {Reset} from '../routes/Reset';
import {ServeApp} from '../routes/ServeApp';
import {ServeAsset} from '../routes/ServeAsset';
import {serverId, statsId} from '../utils/server-ids';
import {newIpBlocklist} from './IPBlocklist';
import {newIpTracker} from './IPTracker';
import {SessionManager} from './auth/SessionManager';
import * as authcookies from './auth/authcookies';
import {DiscordUser} from './auth/discord';
import {getHerokuIpAddress} from './heroku';
import * as responses from './responses';

const metrics = {
  count: new prometheus.Counter({
    name: 'http_request_count',
    help: 'Request count',
    registers: [prometheus.register],
    labelNames: ['path', 'method'],
  }),
  latency: new prometheus.Histogram({
    name: 'http_request_latency',
    help: 'Request latency',
    registers: [prometheus.register],
    labelNames: ['path'],
    buckets: [0.1, 0.25, 0.5, 1, 2.5, 5, 10, 25, 50, 100, 250, 500, 1000],
  }),
};

const clock = new Clock();

const ips = (process.env.IP_BLOCKLIST ?? '').trim().split(' ');
const ipBlocklist = newIpBlocklist(ips);
const ipTracker = newIpTracker();

const handlers: Map<string, IHandler> = new Map(
  [
    ['', ServeApp.INSTANCE],
    [paths.ADMIN, ServeApp.INSTANCE],
    // TODO(kberg): What is this?
    [paths.API_CLONEABLEGAME, ApiCloneableGame.INSTANCE],
    [paths.API_CREATEGAME, ApiCreateGame.INSTANCE],
    [paths.API_GAME, ApiGame.INSTANCE],
    [paths.API_GAME_HISTORY, ApiGameHistory.INSTANCE],
    [paths.API_GAME_LOGS, ApiGameLogs.INSTANCE],
    [paths.API_GAMES, ApiGames.INSTANCE],
    [paths.API_IPS, ApiIPs.INSTANCE],
    [paths.API_METRICS, ApiMetrics.INSTANCE],
    [paths.API_PLAYER, ApiPlayer.INSTANCE],
    [paths.API_STATS, ApiStats.INSTANCE],
    [paths.API_SPECTATOR, ApiSpectator.INSTANCE],
    [paths.API_WAITING_FOR, ApiWaitingFor.INSTANCE],
    [paths.AUTOPASS, Autopass.INSTANCE],
    [paths.CARDS, ServeApp.INSTANCE],
    ['favicon.ico', ServeAsset.INSTANCE],
    [paths.GAME, GameHandler.INSTANCE],
    [paths.GAMES_OVERVIEW, GamesOverview.INSTANCE],
    [paths.HELP, ServeApp.INSTANCE],
    [paths.LOAD, Load.INSTANCE],
    [paths.LOAD_GAME, LoadGame.INSTANCE],
    [paths.LOGIN, Login.INSTANCE],
    [paths.API_LOGOUT, ApiLogout.INSTANCE],
    ['main.js', ServeAsset.INSTANCE],
    ['main.js.map', ServeAsset.INSTANCE],
    [paths.AUTH_DISCORD_CALLBACK, DiscordAuth.INSTANCE],
    [paths.NEW_GAME, ServeApp.INSTANCE],
    [paths.PLAYER, ServeApp.INSTANCE],
    [paths.PLAYER_INPUT, PlayerInput.INSTANCE],
    [paths.API_PROFILE, ApiProfile.INSTANCE],
    [paths.RESET, Reset.INSTANCE],
    [paths.SPECTATOR, ServeApp.INSTANCE],
    ['styles.css', ServeAsset.INSTANCE],
    [paths.THE_END, ServeApp.INSTANCE],
  ],
);

function getIPAddress(req: Request): string {
  const herokuIpAddress = getHerokuIpAddress(req);
  if (herokuIpAddress !== undefined) {
    return herokuIpAddress;
  }
  const socketIpAddress = req.socket.address();
  if (typeof socketIpAddress === 'object') {
    return '!' + socketIpAddress.address + '!';
  }
  return socketIpAddress;
}

function getHandler(pathname: string): IHandler | undefined {
  const handler: IHandler | undefined = handlers.get(pathname);
  if (handler !== undefined) {
    return handler;
  }
  if (pathname.startsWith('assets/') || pathname === 'sw.js') {
    return ServeAsset.INSTANCE;
  }
  return undefined;
}

export function processRequest(req: Request, res: Response): void {
  const start = process.hrtime.bigint();
  let pathnameForLatency: string | undefined = undefined;
  try {
    const ipAddress = getIPAddress(req);
    ipTracker.add(ipAddress);
    if (ipBlocklist.isBlocked(ipAddress)) {
      responses.notFound(req, res);
    }

    if (req.method === 'HEAD') {
      res.end();
      return;
    }
    if (req.url === undefined) {
      responses.notFound(req, res);
      return;
    }

    const sessionManager = SessionManager.getInstance();
    let user: DiscordUser | undefined = undefined;
    let sessionid: SessionId | undefined = undefined;
    try {
      sessionid = authcookies.extract(req);
      if (sessionid !== undefined) {
        user = sessionManager.get(sessionid);
      }
    } catch (e) {
      console.error('While extracting cookies', e);
    }

    const url = new URL(req.url, `http://${req.headers.host}`);
    const ctx: Context = {
      url: url,
      clock,
      gameLoader: GameLoader.getInstance(),
      sessionManager: sessionManager,
      ip: getIPAddress(req),
      ipTracker: ipTracker,
      ids: {
        serverId,
        statsId,
      },
      sessionid,
      user: user,
    };

    const pathname = url.pathname.substring(1); // Remove leading '/'
    pathnameForLatency = pathname;
    const handler = getHandler(pathname);
    if (handler !== undefined) {
      metrics.count.inc({path: pathname, method: req.method});
      handler.processRequest(req, res, ctx);
    } else {
      pathnameForLatency = undefined;
      responses.notFound(req, res);
    }
  } finally {
    const duration = Number(process.hrtime.bigint() - start) / 1_000_000;
    metrics.latency.observe({path: pathnameForLatency}, Number(duration));
  }
}
