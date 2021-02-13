require('dotenv').config();
require('console-stamp')(
  console,
  {format: ':date(yyyy-mm-dd HH:MM:ss Z)'},
);

import * as https from 'https';
import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import * as querystring from 'querystring';
import * as zlib from 'zlib';

import {BoardName} from './boards/BoardName';
import {BufferCache} from './server/BufferCache';
import {Game, GameId} from './Game';
import {GameLoader} from './database/GameLoader';
import {GameLogs} from './routes/GameLogs';
import {Route} from './routes/Route';
import {Player} from './Player';
import {Database} from './database/Database';
import {Server} from './server/ServerModel';
import {Cloner} from './database/Cloner';

const serverId = process.env.SERVER_ID || generateRandomId();
const route = new Route();
const gameLogs = new GameLogs();
const assetCacheMaxAge = process.env.ASSET_CACHE_MAX_AGE || 0;
const fileCache = new BufferCache();

const isProduction = process.env.NODE_ENV === 'production';

// prime the cache and compress styles.css
const styles = fs.readFileSync('build/styles.css');
fileCache.set('styles.css', styles);
zlib.gzip(styles, function(err, compressed) {
  if (err !== null) {
    console.warn('error compressing styles', err);
    return;
  }
  fileCache.set('styles.css.gz', compressed);
});

function processRequest(req: http.IncomingMessage, res: http.ServerResponse): void {
  if (req.url !== undefined) {
    if (req.method === 'GET') {
      if (req.url.replace(/\?.*$/, '').startsWith('/games-overview')) {
        if (!isServerIdValid(req)) {
          route.notAuthorized(req, res);
          return;
        } else {
          serveApp(req, res);
        }
      } else if (
        req.url === '/' ||
        req.url.startsWith('/new-game') ||
        req.url.startsWith('/solo') ||
        req.url.startsWith('/game?id=') ||
        req.url.startsWith('/player?id=') ||
        req.url.startsWith('/the-end?id=') ||
        req.url.startsWith('/load') ||
        req.url.startsWith('/debug-ui') ||
        req.url.startsWith('/help-iconology')
      ) {
        serveApp(req, res);
      } else if (req.url.startsWith('/api/player?id=')) {
        apiGetPlayer(req, res);
      } else if (req.url.startsWith('/api/waitingfor?id=')) {
        apiGetWaitingFor(req, res);
      } else if (req.url.startsWith('/assets/translations.json')) {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'max-age=' + assetCacheMaxAge);
        res.write(fs.readFileSync('build/genfiles/translations.json'));
        res.end();
      } else if (
        req.url.startsWith('/assets/') ||
        req.url === '/styles.css' ||
        req.url === '/favicon.ico' ||
        req.url === '/main.js' ||
        req.url === '/main.js.map'
      ) {
        serveAsset(req, res);
      } else if (req.url.startsWith('/api/games')) {
        apiGetGames(req, res);
      } else if (req.url.indexOf('/api/game?id=') === 0) {
        apiGetGame(req, res);
      } else if (gameLogs.canHandle(req.url)) {
        gameLogs.handle(req, res);
      } else if (req.url.startsWith('/api/clonablegames')) {
        getClonableGames(res);
      } else {
        route.notFound(req, res);
      }
    } else if (req.method === 'PUT' && req.url.indexOf('/game') === 0) {
      createGame(req, res);
    } else if (req.method === 'PUT' && req.url.indexOf('/load') === 0) {
      loadGame(req, res);
    } else if (
      req.method === 'POST' &&
      req.url.indexOf('/player/input?id=') === 0
    ) {
      const playerId: string = req.url.substring(
        '/player/input?id='.length,
      );
      GameLoader.getInstance().getByPlayerId(playerId, (game) => {
        if (game === undefined) {
          route.notFound(req, res);
          return;
        }
        let player: Player | undefined;
        try {
          player = game.getPlayerById(playerId);
        } catch (err) {
          console.warn(`unable to find player ${playerId}`, err);
        }
        if (player === undefined) {
          route.notFound(req, res);
          return;
        }
        processInput(req, res, player, game);
      });
    } else {
      route.notFound(req, res);
    }
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

function generateRandomId(): GameId {
  // 281474976710656 possible values.
  return Math.floor(Math.random() * Math.pow(16, 12)).toString(16);
}

function processInput(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  player: Player,
  game: Game,
): void {
  let body = '';
  req.on('data', function(data) {
    body += data.toString();
  });
  req.once('end', function() {
    try {
      const entity = JSON.parse(body);
      player.process(entity);
      res.setHeader('Content-Type', 'application/json');
      res.write(getPlayerModelJSON(player, game));
      res.end();
    } catch (err) {
      res.writeHead(400, {
        'Content-Type': 'application/json',
      });
      console.warn('Error processing input from player', err);
      res.write(
        JSON.stringify({
          message: err.message,
        }),
      );
      res.end();
    }
  });
}

function getClonableGames(res: http.ServerResponse): void {
  Database.getInstance().getClonableGames(function(err, allGames) {
    if (err) {
      return;
    }
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(allGames));
    res.end();
  });
}

function apiGetGames(
  req: http.IncomingMessage,
  res: http.ServerResponse,
): void {
  if (!isServerIdValid(req)) {
    route.notAuthorized(req, res);
    return;
  }
  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify(GameLoader.getInstance().getLoadedGameIds()));
  res.end();
}

function loadGame(req: http.IncomingMessage, res: http.ServerResponse): void {
  let body = '';
  req.on('data', function(data) {
    body += data.toString();
  });
  req.once('end', function() {
    try {
      const gameReq = JSON.parse(body);

      const game_id = gameReq.game_id;
      const rollbackCount = gameReq.rollbackCount;
      if (rollbackCount > 0) {
        Database.getInstance().deleteGameNbrSaves(game_id, rollbackCount);
      }
      GameLoader.getInstance().getByGameId(game_id, true, (game) => {
        if (game === undefined) {
          console.warn(`unable to find ${game_id} in database`);
          route.notFound(req, res);
          return;
        }
        res.setHeader('Content-Type', 'application/json');
        res.write(getGameModelJSON(game));
        res.end();
      });
    } catch (error) {
      route.internalServerError(req, res, error);
    }
  });
}

function apiGetGame(req: http.IncomingMessage, res: http.ServerResponse): void {
  const routeRegExp: RegExp = /^\/api\/game\?id\=([0-9a-z_]+)$/i;

  if (req.url === undefined) {
    console.warn('url not defined');
    route.notFound(req, res);
    return;
  }

  if (!routeRegExp.test(req.url)) {
    console.warn('no match with regexp');
    route.notFound(req, res);
    return;
  }

  const matches = req.url.match(routeRegExp);

  if (matches === null || matches[1] === undefined) {
    console.warn('didn\'t find game id');
    route.notFound(req, res);
    return;
  }

  const gameId: GameId = matches[1];

  GameLoader.getInstance().getByGameId(gameId, false, (game: Game | undefined) => {
    if (game === undefined) {
      console.warn('game is undefined');
      route.notFound(req, res);
      return;
    }

    res.setHeader('Content-Type', 'application/json');
    res.write(getGameModelJSON(game));
    res.end();
  });
}

function apiGetWaitingFor(
  req: http.IncomingMessage,
  res: http.ServerResponse,
): void {
  const qs: string = req.url!.substring('/api/waitingfor?'.length);
  const queryParams = querystring.parse(qs);
  const playerId = (queryParams as any)['id'];
  const prevGameAge = parseInt((queryParams as any)['prev-game-age']);
  GameLoader.getInstance().getByPlayerId(playerId, (game) => {
    if (game === undefined) {
      route.notFound(req, res);
      return;
    }
    let player: Player | undefined;
    try {
      player = game.getPlayerById(playerId);
    } catch (err) {
      console.warn(`unable to find player ${playerId}`, err);
    }
    if (player === undefined) {
      route.notFound(req, res);
      return;
    }

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(Server.getWaitingForModel(player, prevGameAge)));
  });
}

function apiGetPlayer(
  req: http.IncomingMessage,
  res: http.ServerResponse,
): void {
  const qs = req.url!.substring('/api/player?'.length);
  const queryParams = querystring.parse(qs);
  let playerId = queryParams['id'] as string | Array<string> | undefined;
  if (Array.isArray(playerId)) {
    playerId = playerId[0];
  }
  if (playerId === undefined) {
    playerId = '';
  }
  GameLoader.getInstance().getByPlayerId(playerId as string, (game) => {
    if (game === undefined) {
      route.notFound(req, res);
      return;
    }
    let player: Player | undefined;
    try {
      player = game.getPlayerById(playerId as string);
    } catch (err) {
      console.warn(`unable to find player ${playerId}`, err);
    }
    if (player === undefined) {
      route.notFound(req, res);
      return;
    }
    res.setHeader('Content-Type', 'application/json');
    res.write(getPlayerModelJSON(player, game));
    res.end();
  });
}

function createGame(req: http.IncomingMessage, res: http.ServerResponse): void {
  let body = '';
  req.on('data', function(data) {
    body += data.toString();
  });
  req.once('end', function() {
    try {
      const gameReq = JSON.parse(body);
      const gameId = generateRandomId();
      const players = gameReq.players.map((obj: any) => {
        return new Player(
          obj.name,
          obj.color,
          obj.beginner,
          Number(obj.handicap), // For some reason handicap is coming up a string.
          generateRandomId(),
        );
      });
      let firstPlayerIdx: number = 0;
      for (let i = 0; i < gameReq.players.length; i++) {
        if (gameReq.players[i].first === true) {
          firstPlayerIdx = i;
          break;
        }
      }

      if (gameReq.board === 'random') {
        const boards = Object.values(BoardName);
        gameReq.board = boards[Math.floor(Math.random() * boards.length)];
      }

      const gameOptions = {
        boardName: gameReq.board,
        clonedGamedId: gameReq.clonedGamedId,

        undoOption: gameReq.undoOption,
        showTimers: gameReq.showTimers,
        fastModeOption: gameReq.fastModeOption,
        showOtherPlayersVP: gameReq.showOtherPlayersVP,

        corporateEra: gameReq.corporateEra,
        venusNextExtension: gameReq.venusNext,
        coloniesExtension: gameReq.colonies,
        preludeExtension: gameReq.prelude,
        turmoilExtension: gameReq.turmoil,
        aresExtension: gameReq.aresExtension,
        aresHazards: true, // Not a runtime option.
        politicalAgendasExtension: gameReq.politicalAgendasExtension,
        moonExpansion: gameReq.moonExpansion,
        promoCardsOption: gameReq.promoCardsOption,
        communityCardsOption: gameReq.communityCardsOption,
        solarPhaseOption: gameReq.solarPhaseOption,
        removeNegativeGlobalEventsOption:
          gameReq.removeNegativeGlobalEventsOption,
        includeVenusMA: gameReq.includeVenusMA,

        draftVariant: gameReq.draftVariant,
        initialDraftVariant: gameReq.initialDraft,
        startingCorporations: gameReq.startingCorporations,
        shuffleMapOption: gameReq.shuffleMapOption,
        randomMA: gameReq.randomMA,
        soloTR: gameReq.soloTR,
        customCorporationsList: gameReq.customCorporationsList,
        cardsBlackList: gameReq.cardsBlackList,
        customColoniesList: gameReq.customColoniesList,
        requiresVenusTrackCompletion: gameReq.requiresVenusTrackCompletion,
        requiresMoonTrackCompletion: gameReq.requiresMoonTrackCompletion,
      };

      if (gameOptions.clonedGamedId !== undefined && !gameOptions.clonedGamedId.startsWith('#')) {
        Database.getInstance().loadCloneableGame(gameOptions.clonedGamedId, (err, serialized) => {
          Cloner.clone(gameId, players, firstPlayerIdx, err, serialized, (err, game) => {
            if (err) {
              throw err;
            }
            if (game === undefined) {
              throw new Error(`game ${gameOptions.clonedGamedId} not cloned`); // how to nest errs in the way Java nests exceptions?
            }
            GameLoader.getInstance().add(game);
            res.setHeader('Content-Type', 'application/json');
            res.write(getGameModelJSON(game));
            res.end();
          });
        });
      } else {
        const seed = Math.random();
        const game = Game.newInstance(gameId, players, players[firstPlayerIdx], gameOptions, seed);
        GameLoader.getInstance().add(game);
        res.setHeader('Content-Type', 'application/json');
        res.write(getGameModelJSON(game));
        res.end();
      }
    } catch (error) {
      route.internalServerError(req, res, error);
    }
  });
}

function getPlayerModelJSON(player: Player, game: Game): string {
  const model = Server.getPlayerModel(player, game);
  return JSON.stringify(model);
}

function getGameModelJSON(game: Game): string {
  const model = Server.getGameModel(game);
  return JSON.stringify(model);
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

function serveApp(req: http.IncomingMessage, res: http.ServerResponse): void {
  req.url = '/assets/index.html';
  serveAsset(req, res);
}

function serveAsset(req: http.IncomingMessage, res: http.ServerResponse): void {
  if (req.url === undefined) {
    route.internalServerError(req, res, new Error('no url on request'));
    return;
  }

  let contentEncoding: string | undefined;
  let contentType: string | undefined;
  let file: string | undefined;

  if (req.url === '/styles.css') {
    const compressed = fileCache.get('styles.css.gz');
    contentType = 'text/css';
    file = 'styles.css';
    if (compressed !== undefined && supportsEncoding(req, 'gzip')) {
      contentEncoding = 'gzip';
      file += '.gz';
    }
  } else if (req.url === '/assets/index.html') {
    contentType = 'text/html; charset=utf-8';
    file = req.url.substring(1);
  } else if (req.url === '/favicon.ico') {
    contentType = 'image/x-icon';
    file = 'assets/favicon.ico';
  } else if (req.url === '/main.js' || req.url === '/main.js.map') {
    contentType = 'text/javascript';
    file = `build${req.url}`;
    if (supportsEncoding(req, 'br')) {
      contentEncoding = 'br';
      file += '.br';
    } else if (supportsEncoding(req, 'gzip')) {
      contentEncoding = 'gzip';
      file += '.gz';
    }
  } else if (req.url === '/assets/Prototype.ttf' || req.url === '/assets/futureforces.ttf') {
    contentType = 'font/ttf';
    file = req.url.substring(1);
  } else if (req.url.endsWith('.png') || req.url.endsWith('.jpg')) {
    const assetsRoot = path.resolve('./assets');
    const reqFile = path.resolve(path.normalize(req.url).slice(1));

    // Disallow to go outside of assets directory
    if (reqFile.startsWith(assetsRoot) === false) {
      return route.notFound(req, res);
    }
    contentType = req.url.endsWith('.jpg') ? 'image/jpeg' : 'image/png';
    file = reqFile;
  } else {
    return route.notFound(req, res);
  }
  // asset caching
  const buffer = fileCache.get(file);
  if (buffer !== undefined) {
    if (req.headers['if-none-match'] === buffer.hash) {
      route.notModified(res);
      return;
    }
    res.setHeader('Cache-Control', 'must-revalidate');
    res.setHeader('ETag', buffer.hash);
  } else if (isProduction === false && req.url !== '/main.js' && req.url !== '/main.js.map') {
    res.setHeader('Cache-Control', 'max-age=' + assetCacheMaxAge);
  }

  if (contentType !== undefined) {
    res.setHeader('Content-Type', contentType);
  }

  if (contentEncoding !== undefined) {
    res.setHeader('Content-Encoding', contentEncoding);
  }

  if (buffer !== undefined) {
    res.setHeader('Content-Length', buffer.buffer.length);
    res.end(buffer.buffer);
    return;
  }

  const finalFile = file;

  fs.readFile(finalFile, function(err, data) {
    if (err) {
      return route.internalServerError(req, res, err);
    }
    res.setHeader('Content-Length', data.length);
    res.end(data);
    // only production caches resources
    if (isProduction === true) {
      fileCache.set(finalFile, data);
    }
  });
}

function supportsEncoding(req: http.IncomingMessage, encoding: 'gzip' | 'br'): boolean {
  return req.headers['accept-encoding'] !== undefined &&
         req.headers['accept-encoding'].includes(encoding);
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

