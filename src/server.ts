require('dotenv').config();
require('console-stamp')(
  console,
  {format: ':date(yyyy-mm-dd HH:MM:ss Z)'},
);

import * as https from 'https';
import * as http from 'http';
import * as fs from 'fs';
import * as querystring from 'querystring';

import {GameId} from './Game';
import {ApiCloneableGames} from './routes/ApiCloneableGames';
import {ApiGameLogs} from './routes/ApiGameLogs';
import {ApiGames} from './routes/ApiGames';
import {ApiGame} from './routes/ApiGame';
import {ApiPlayer} from './routes/ApiPlayer';
import {ApiWaitingFor} from './routes/ApiWaitingFor';
import {GameHandler} from './routes/Game';
import {LoadGame} from './routes/LoadGame';
import {IHandler} from './routes/IHandler';
import {Route} from './routes/Route';
import {Database} from './database/Database';
import {PlayerInput} from './routes/PlayerInput';
import {GameLoader} from './database/GameLoader';
import {ServeApp} from './routes/ServeApp';
import {ServeAsset} from './routes/ServeAsset';

const serverId = process.env.SERVER_ID || generateRandomId();
const route = new Route();

const handlers: Map<string, IHandler> = new Map(
  [
    // ['/games-overview', GamesOverview.INSTANCE],
    ['/', ServeApp.INSTANCE],
    ['/new-game', ServeApp.INSTANCE],
    ['/solo', ServeApp.INSTANCE],
    ['/player', ServeApp.INSTANCE],
    ['/the-end', ServeApp.INSTANCE],
    ['/load', ServeApp.INSTANCE],
    ['/cards', ServeApp.INSTANCE],
    ['/help', ServeApp.INSTANCE],
    ['/styles.css', ServeAsset.INSTANCE],
    ['/favicon.ico', ServeAsset.INSTANCE],
    ['/main.js', ServeAsset.INSTANCE],
    ['/main.js.map', ServeAsset.INSTANCE],
    ['/api/player', ApiPlayer.INSTANCE],
    ['/api/waitingfor', ApiWaitingFor.INSTANCE],
    ['/api/games', ApiGames.INSTANCE],
    ['/api/game', ApiGame.INSTANCE],
    ['/api/clonablegames', ApiCloneableGames.INSTANCE],
    ['/api/cloneablegames', ApiCloneableGames.INSTANCE],
    ['/api/game/logs', ApiGameLogs.INSTANCE],
    ['/game', GameHandler.INSTANCE],
    ['/load', LoadGame.INSTANCE],
    ['/player/input', PlayerInput.INSTANCE],
  ],
);

function processRequest(req: http.IncomingMessage, res: http.ServerResponse): void {
  if (req.url === undefined) {
    route.notFound(req, res);
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const ctx = {url, route, serverId, gameLoader: GameLoader.getInstance()};
  const handler: IHandler | undefined = handlers.get(url.pathname);

  if (handler !== undefined) {
    handler.processRequest(req, res, ctx);
    return;
  }

  switch (req.method) {
  case 'GET':
    switch (url.pathname) {
    case '/games-overview':
      if (!isServerIdValid(req)) {
        route.notAuthorized(req, res);
        return;
      } else {
        ServeApp.INSTANCE.get(req, res, ctx);
      }
      break;

    default:
      if (url.pathname.startsWith('/assets/')) {
        ServeAsset.INSTANCE.get(req, res, ctx);
      } else {
        route.notFound(req, res);
      }
    }
    break;

  default:
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

function generateRandomId(): GameId {
  // 281474976710656 possible values.
  return Math.floor(Math.random() * Math.pow(16, 12)).toString(16);
}

function isServerIdValid(req: http.IncomingMessage): boolean {
  const queryParams = querystring.parse(req.url!.replace(/^.*\?/, ''));
  if (
    queryParams.serverId === undefined ||
    queryParams.serverId !== serverId
  ) {
    console.warn('No or invalid serverId given');
    return false;
  }
  return true;
}

console.log('Starting server on port ' + (process.env.PORT || 8080));

try {
  // The first call to Database.getInstance also intiailizes a connection to the database. Better to
  // fail here than after the server opens to process requests.
  Database.getInstance().purgeUnfinishedGames();
} catch (err) {
  console.error('Cannot connect to database:', err);
  throw err;
}

console.log('version 0.X');

server.listen(process.env.PORT || 8080);

console.log(
  '\nThe secret serverId for this server is \x1b[1m' +
  serverId +
  '\x1b[0m. Use it to access the following administrative routes:\n',
);
console.log(
  '* Overview of existing games: /games-overview?serverId=' + serverId,
);
console.log('* API for game IDs: /api/games?serverId=' + serverId + '\n');

