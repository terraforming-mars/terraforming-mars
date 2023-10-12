require('dotenv').config();
require('console-stamp')(
  console,
  {format: ':date(yyyy-mm-dd HH:MM:ss Z)'},
);

import * as https from 'https';
import * as http from 'http';
import * as fs from 'fs';
import * as raw_settings from '../genfiles/settings.json';
import * as prometheus from 'prom-client';

import {Database} from './database/Database';
import {runId, serverId} from './utils/server-ids';
import {Route} from './routes/Route';
import {processRequest} from './server/requestProcessor';
import {timeAsync} from './utils/timer';
import {registerBehaviorExecutor} from './behavior/BehaviorExecutor';
import {Executor} from './behavior/Executor';
import {GameLoader} from './database/GameLoader';

process.on('uncaughtException', (err: any) => {
  console.error('UNCAUGHT EXCEPTION', err);
});

const route = new Route();

function requestHandler(req: http.IncomingMessage, res: http.ServerResponse): void {
  try {
    processRequest(req, res, route);
  } catch (error) {
    route.internalServerError(req, res, error);
  }
}

const metrics = {
  startServer: new prometheus.Gauge({
    name: 'server_start_server',
    help: 'Time to initialize the server',
    registers: [prometheus.register],
  }),
  startDatabase: new prometheus.Gauge({
    name: 'server_start_database',
    help: 'Time to initialize the database',
    registers: [prometheus.register],
  }),

};

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

async function start() {
  prometheus.register.setDefaultLabels({
    app: 'terraforming-mars-app',
  });
  prometheus.collectDefaultMetrics();
  registerBehaviorExecutor(new Executor());

  const server = createServer();

  await timeAsync(Database.getInstance().initialize())
    .then((v) => {
      metrics.startDatabase.set(v.duration);
    });

  try {
    const stats = await Database.getInstance().stats();
    console.log(JSON.stringify(stats, undefined, 2));
  } catch (err) {
    // Do not fail. Just continue. Stats aren't vital.
    console.error(err);
  }
  GameLoader.getInstance().maintenance();

  const port = process.env.PORT || 8080;
  console.log(`Starting ${raw_settings.head}, built at ${raw_settings.builtAt}`);
  console.log(`Starting server on port ${port}`);

  server.listen(port);

  if (!process.env.SERVER_ID) {
    console.log(`The secret serverId for this server is \x1b[1m${serverId}\x1b[0m.`);
    console.log(`Administrative routes can be found at admin?serverId=${serverId}`);
  }
  console.log(`The public run ID is ${runId}`);
  console.log('Server is ready.');
}

try {
  start();
} catch (err) {
  console.error('Cannot start server:');
  console.error(err);
}
