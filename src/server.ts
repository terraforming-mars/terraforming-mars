require('dotenv').config();
require('console-stamp')(
  console,
  {format: ':date(yyyy-mm-dd HH:MM:ss Z)'},
);

import * as https from 'https';
import * as http from 'http';
import * as fs from 'fs';
import * as raw_settings from './genfiles/settings.json';

import {ApiCloneableGame} from './routes/ApiCloneableGame';
import {ApiGameLogs} from './routes/ApiGameLogs';
import {ApiGames} from './routes/ApiGames';
import {ApiGame} from './routes/ApiGame';
import {ApiGameHistory} from './routes/ApiGameHistory';
import {ApiPlayer} from './routes/ApiPlayer';
import {ApiStats} from './routes/ApiStats';
import {ApiSpectator} from './routes/ApiSpectator';
import {ApiWaitingFor} from './routes/ApiWaitingFor';
import {Database} from './database/Database';
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

process.on('uncaughtException', (err: any) => {
  console.error('UNCAUGHT EXCEPTION', err);
});

const serverId = process.env.SERVER_ID || GameHandler.INSTANCE.generateRandomId('');
const route = new Route();

const handlers: Map<string, IHandler> = new Map(
  [
    ['/', ServeApp.INSTANCE],
    ['/api/cloneablegame', ApiCloneableGame.INSTANCE],
    ['/api/game', ApiGame.INSTANCE],
    ['/api/game/history', ApiGameHistory.INSTANCE],
    ['/api/game/logs', ApiGameLogs.INSTANCE],
    ['/api/games', ApiGames.INSTANCE],
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
    ['/solo', ServeApp.INSTANCE],
    ['/spectator', ServeApp.INSTANCE],
    ['/styles.css', ServeAsset.INSTANCE],
    ['/sw.js', ServeAsset.INSTANCE],
    ['/the-end', ServeApp.INSTANCE],
  ],
);

function processRequest(req: http.IncomingMessage, res: http.ServerResponse): void {
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

function requestHandler(
  req: http.IncomingMessage,
  res: http.ServerResponse,
): void {
  try {
    processRequest(req, res);
  } catch (error) {
    route.internalServerError(req, res, error);
  }
}

let server: http.Server | https.Server;

// If they've set up https
if (process.env.KEY_PATH && process.env.CERT_PATH) {
  const httpsHowto =
    'https://nodejs.org/en/knowledge/HTTP/servers/how-to-create-a-HTTPS-server/';
  if (!fs.existsSync(process.env.KEY_PATH)) {
    console.error(
      'TLS KEY_PATH is set in .env, but cannot find key! Check out ' +
      httpsHowto,
    );
  } else if (!fs.existsSync(process.env.CERT_PATH)) {
    console.error(
      'TLS CERT_PATH is set in .env, but cannot find cert! Check out' +
      httpsHowto,
    );
  }
  const options = {
    key: fs.readFileSync(process.env.KEY_PATH),
    cert: fs.readFileSync(process.env.CERT_PATH),
  };
  server = https.createServer(options, requestHandler);
} else {
  server = http.createServer(requestHandler);
}

Database.getInstance().initialize()
  .catch((err) => {
    console.error('Cannot connect to database:', err);
    throw err;
  }).then(async () => {
    const stats = await Database.getInstance().stats();
    console.log(JSON.stringify(stats, undefined, 2));
  }).catch((err) => {
    console.error('Cannot generate stats:', err);
    // Do not fail.
  }).then(() => {
    Database.getInstance().purgeUnfinishedGames();

    const port = process.env.PORT || 8080;
    console.log(`Starting ${raw_settings.head}, built at ${raw_settings.builtAt}`);
    console.log(`Starting server on port ${port}`);

    server.listen(port);

    console.log(
      'The secret serverId for this server is \x1b[1m' +
      serverId +
      '\x1b[0m. Use it to access the following administrative routes:',
    );
    console.log(
      '* Overview of existing games: /games-overview?serverId=' + serverId,
    );
    console.log('* API for game IDs: /api/games?serverId=' + serverId + '\n');
  }).catch((err) => {
    console.error('Cannot start server:', err);
    throw err;
  });

