require('dotenv').config();
require('console-stamp')(
  console,
  {format: ':date(yyyy-mm-dd HH:MM:ss Z)'},
);

import * as https from 'https';
import * as http from 'http';
import * as fs from 'fs';
import * as raw_settings from './genfiles/settings.json';

import {Database} from './database/Database';
import {GameHandler} from './routes/Game';
import {Route} from './routes/Route';
import {processRequest} from './server/requestProcessor';
import {Metrics} from './server/metrics';

process.on('uncaughtException', (err: any) => {
  console.error('UNCAUGHT EXCEPTION', err);
});

const serverId = process.env.SERVER_ID || GameHandler.INSTANCE.generateRandomId('');
const route = new Route();

function requestHandler(req: http.IncomingMessage, res: http.ServerResponse): void {
  try {
    processRequest(req, res, route, serverId);
  } catch (error) {
    route.internalServerError(req, res, error);
  }
}


function createServer(): http.Server | https.Server {
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
    return https.createServer(options, requestHandler);
  } else {
    return http.createServer(requestHandler);
  }
}

let server: http.Server | https.Server;
async function start() {
  const metrics = Metrics.INSTANCE;

  server = createServer();

  metrics.mark('startup-initialzeServer');

  await Database.getInstance().initialize();

  metrics.mark('startup-initialzeDatabase');

  try {
    const stats = await Database.getInstance().stats();
    console.log(JSON.stringify(stats, undefined, 2));
  } catch (err) {
    // Do not fail. Just continue. Stats aren't vital.
    console.error(err);
  }
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

  metrics.mark('startup-ready');
}

try {
  start();
} catch (err) {
  console.error('Cannot start server:');
  console.error(err);
}
