require('dotenv').config();
require('console-stamp')(
  console,
  {format: ':date(yyyy-mm-dd HH:MM:ss Z)'},
);

import * as https from 'https';
import * as http from 'http';
import * as fs from 'fs';

import {GameId} from './Game';
import {Route} from './routes/Route';
import {IHandler} from './routes/IHandler';
import {ServeAsset} from './routes/ServeAsset';
import {ServeApp} from './routes/ServeApp';
import {GamesOverview} from './routes/GamesOverview';
import {ApiGetPlayer} from './routes/ApiGetPlayer';
import {ApiGetWaitingFor} from './routes/ApiGetWaitingFor';
import {ApiGetGames} from './routes/ApiGetGames';
import {ApiGetGame} from './routes/ApiGetGame';
import {ApiCloneableGames} from './routes/ApiCloneableGames';
import {CreateGame} from './routes/CreateGame';
import {LoadGame} from './routes/LoadGame';
import {PlayerInput} from './routes/PlayerInput';
import {ApiGameLogs} from './routes/ApiGameLogs';
import {Database} from './database/Database';

const serverId = process.env.SERVER_ID || generateRandomId();
const route = new Route();

const serveAsset: IHandler = ServeAsset.newInstance();
const gamesOverview = GamesOverview.newInstance();
const serveApp = ServeApp.newInstance();
const handlers: Map<string, IHandler> = new Map(
  [
    ['/games-overview', gamesOverview],
    ['/', serveApp],
    ['/new-game', serveApp],
    ['/solo', serveApp],
    ['/game', serveApp],
    ['/player', serveApp],
    ['/the-end', serveApp],
    ['/load', serveApp],
    ['/debug-ui', serveApp],
    ['/help-iconology', serveApp],
    ['/styles.css', serveAsset],
    ['/favicon.ico', serveAsset],
    ['/main.js', serveAsset],
    ['/main.js.map', serveAsset],
    ['/api/player', ApiGetPlayer.newInstance()],
    ['/api/waitingfor', ApiGetWaitingFor.newInstance()],
    ['/api/games', ApiGetGames.newInstance()],
    ['/api/game', ApiGetGame.newInstance()],
    ['/api/clonablegames', ApiCloneableGames.newInstance()],
    ['/api/game/logs', ApiGameLogs.newInstance()],
    ['/game/', CreateGame.newInstance()],
    ['/load/', LoadGame.newInstance()],
    ['/player/input', PlayerInput.newInstance()],
  ],
);

function processRequest(req: http.IncomingMessage, res: http.ServerResponse): void {
  if (req.url === undefined) {
    route.notFound(req, res);
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const ctx = {url, route, serverId};

  // Shortcut for all assets.
  if (url.pathname.startsWith('/assets/')) {
    serveAsset.processRequest(req, res, ctx);
  }

  const handler: IHandler | undefined = handlers.get(url.pathname);
  if (handler === undefined) {
    route.notFound(req, res);
    return;
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

