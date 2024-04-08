import * as prometheus from 'prom-client';
import * as responses from '../routes/responses';

import {paths} from '../../common/app/paths';

import {ApiCloneableGame} from '../routes/ApiCloneableGame';
import {ApiGameLogs} from '../routes/ApiGameLogs';
import {ApiGames} from '../routes/ApiGames';
import {ApiGame} from '../routes/ApiGame';
import {ApiGameHistory} from '../routes/ApiGameHistory';
import {ApiPlayer} from '../routes/ApiPlayer';
import {ApiStats} from '../routes/ApiStats';
import {ApiMetrics} from '../routes/ApiMetrics';
import {ApiSpectator} from '../routes/ApiSpectator';
import {ApiWaitingFor} from '../routes/ApiWaitingFor';
import {GameHandler} from '../routes/Game';
import {GameLoader} from '../database/GameLoader';
import {GamesOverview} from '../routes/GamesOverview';
import {Context, IHandler} from '../routes/IHandler';
import {Load} from '../routes/Load';
import {LoadGame} from '../routes/LoadGame';
import {PlayerInput} from '../routes/PlayerInput';
import {ServeApp} from '../routes/ServeApp';
import {ServeAsset} from '../routes/ServeAsset';
import {serverId, statsId} from '../utils/server-ids';
import {Reset} from '../routes/Reset';
import {newIpBlocklist} from './IPBlocklist';
import {ApiIPs} from '../routes/ApiIPs';
import {newIpTracker} from './IPTracker';
import {getHerokuIpAddress} from './heroku';
import {Request} from '../Request';
import {Response} from '../Response';
import {Clock} from '../../common/Timer';

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
    [paths.API_CLONEABLEGAME, ApiCloneableGame.INSTANCE],
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
    [paths.CARDS, ServeApp.INSTANCE],
    ['favicon.ico', ServeAsset.INSTANCE],
    [paths.GAME, GameHandler.INSTANCE],
    [paths.GAMES_OVERVIEW, GamesOverview.INSTANCE],
    [paths.HELP, ServeApp.INSTANCE],
    [paths.LOAD, Load.INSTANCE],
    [paths.LOAD_GAME, LoadGame.INSTANCE],
    ['main.js', ServeAsset.INSTANCE],
    ['main.js.map', ServeAsset.INSTANCE],
    [paths.NEW_GAME, ServeApp.INSTANCE],
    [paths.PLAYER, ServeApp.INSTANCE],
    [paths.PLAYER_INPUT, PlayerInput.INSTANCE],
    [paths.RESET, Reset.INSTANCE],
    [paths.SPECTATOR, ServeApp.INSTANCE],
    ['styles.css', ServeAsset.INSTANCE],
    ['sw.js', ServeAsset.INSTANCE],
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
  if (pathname.startsWith('assets/')) {
    return ServeAsset.INSTANCE;
  }
  return undefined;
}

export function processRequest(
  req: Request,
  res: Response): void {
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

    const url = new URL(req.url, `http://${req.headers.host}`);
    const ctx: Context = {
      url: url,
      clock,
      gameLoader: GameLoader.getInstance(),
      ip: getIPAddress(req),
      ipTracker: ipTracker,
      ids: {
        serverId,
        statsId,
      }};

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
