import * as http from 'http';

import {ApiCloneableGame} from './routes/ApiCloneableGame';
import {ApiGameLogs} from './routes/ApiGameLogs';
import {ApiGames} from './routes/ApiGames';
import {ApiGame} from './routes/ApiGame';
import {ApiGameHistory} from './routes/ApiGameHistory';
import {ApiPlayer} from './routes/ApiPlayer';
import {ApiStats} from './routes/ApiStats';
import {ApiMetrics} from './routes/ApiMetrics';
import {ApiSpectator} from './routes/ApiSpectator';
import {ApiWaitingFor} from './routes/ApiWaitingFor';
import {GameHandler} from './routes/Game';
import {GameLoader} from './database/GameLoader';
import {GamesOverview} from './routes/GamesOverview';
import {IHandler} from './routes/IHandler';
import {Load} from './routes/Load';
import {LoadGame} from './routes/LoadGame';
import {Route} from './routes/Route';
import {PlayerInput} from './routes/PlayerInput';
import {ServeApp} from './routes/ServeApp';
import {ServeAsset} from './routes/ServeAsset';

const handlers: Map<string, IHandler> = new Map(
  [
    ['/', ServeApp.INSTANCE],
    ['/admin', ServeApp.INSTANCE],
    ['/api/cloneablegame', ApiCloneableGame.INSTANCE],
    ['/api/game', ApiGame.INSTANCE],
    ['/api/game/history', ApiGameHistory.INSTANCE],
    ['/api/game/logs', ApiGameLogs.INSTANCE],
    ['/api/games', ApiGames.INSTANCE],
    ['/api/metrics', ApiMetrics.INSTANCE],
    ['/api/player', ApiPlayer.INSTANCE],
    ['/api/stats', ApiStats.INSTANCE],
    ['/api/spectator', ApiSpectator.INSTANCE],
    ['/api/waitingfor', ApiWaitingFor.INSTANCE],
    ['/cards', ServeApp.INSTANCE],
    ['/favicon.ico', ServeAsset.INSTANCE],
    ['/game', GameHandler.INSTANCE],
    ['/games-overview', GamesOverview.INSTANCE],
    ['/help', ServeApp.INSTANCE],
    ['/load', Load.INSTANCE],
    ['/load_game', LoadGame.INSTANCE],
    ['/main.js', ServeAsset.INSTANCE],
    ['/main.js.map', ServeAsset.INSTANCE],
    ['/new-game', ServeApp.INSTANCE],
    ['/player', ServeApp.INSTANCE],
    ['/player/input', PlayerInput.INSTANCE],
    ['/spectator', ServeApp.INSTANCE],
    ['/styles.css', ServeAsset.INSTANCE],
    ['/sw.js', ServeAsset.INSTANCE],
    ['/the-end', ServeApp.INSTANCE],
  ],
);

export function processRequest(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  route: Route,
  serverId: string): void {
  if (req.method === 'HEAD') {
    res.end();
    return;
  }
  if (req.url === undefined) {
    route.notFound(req, res);
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const ctx = {url, route, serverId, gameLoader: GameLoader.getInstance()};
  const handler: IHandler | undefined = handlers.get(url.pathname);

  if (handler !== undefined) {
    handler.processRequest(req, res, ctx);
  } else if (req.method === 'GET' && url.pathname.startsWith('/assets/')) {
    ServeAsset.INSTANCE.get(req, res, ctx);
  } else {
    route.notFound(req, res);
  }
}
