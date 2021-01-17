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

import {BoardName} from './src/boards/BoardName';
import {Game, GameId} from './src/Game';
import {GameLoader} from './src/database/GameLoader';
import {GameLogs} from './src/routes/GameLogs';
import {Route} from './src/routes/Route';
import {Phase} from './src/Phase';
import {Player} from './src/Player';
import {Database} from './src/database/Database';
import {Server} from './src/server/ServerModel';
import {Cloner} from './src/database/Cloner';

const serverId = process.env.SERVER_ID || generateRandomId();
const styles = fs.readFileSync('styles.css');
let compressedStyles: undefined | Buffer = undefined;
const route = new Route();
const gameLogs = new GameLogs();
const assetCacheMaxAge = process.env.ASSET_CACHE_MAX_AGE || 0;
const fileCache = new Map<string, Buffer>();
const isProduction = process.env.NODE_ENV === 'production';

// compress styles.css
zlib.gzip(styles, function(err, compressed) {
  if (err !== null) {
    console.warn('error compressing styles', err);
    return;
  }
  compressedStyles = compressed;
});

function readFile(path: string, cb: (err: Error | null, data: Buffer) => void): void {
  const result = fileCache.get(path);
  if (isProduction === false || result === undefined) {
    fs.readFile(path, (err1, data1) => {
      if (err1) {
        cb(err1, Buffer.alloc(0));
        return;
      }
      fileCache.set(path, data1);
      cb(null, data1);
    });
  } else {
    cb(null, result);
  }
}

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
        res.write(fs.readFileSync('assets/translations.json'));
        res.end();
      } else if (req.url === '/styles.css') {
        res.setHeader('Content-Type', 'text/css');
        res.setHeader('Cache-Control', 'max-age=' + assetCacheMaxAge);
        serveStyles(req, res);
      } else if (
        req.url.startsWith('/assets/') ||
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
    const answer = {
      'result': 'WAIT',
      'player': game.getPlayerById(game.activePlayer).name,
    };
    if (player.getWaitingFor() !== undefined || game.phase === Phase.END) {
      answer['result'] = 'GO';
    } else if (game.gameAge > prevGameAge) {
      answer['result'] = 'REFRESH';
    }
    res.write(JSON.stringify(answer));
    res.end();
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
  readFile('index.html', function(err, data) {
    if (err) {
      return route.internalServerError(req, res, err);
    }
    res.setHeader('Content-Length', data.length);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(data);
  });
}

function serveAsset(req: http.IncomingMessage, res: http.ServerResponse): void {
  if (req.url === undefined) throw new Error('Empty url');

  let file: string | undefined;

  if (req.url === '/favicon.ico') {
    res.setHeader('Content-Type', 'image/x-icon');
    file = 'favicon.ico';
  } else if (req.url === '/main.js' || req.url === '/main.js.map') {
    res.setHeader('Content-Type', 'text/javascript');
    let suffix = '';
    if (supportsGzip(req)) {
      res.setHeader('Content-Encoding', 'gzip');
      suffix = '.gz';
    }
    file = `build${req.url}${suffix}`;
  } else if (req.url === '/assets/Prototype.ttf') {
    file = 'assets/Prototype.ttf';
  } else if (req.url === '/assets/futureforces.ttf') {
    file = 'assets/futureforces.ttf';
  } else if (req.url.endsWith('.png')) {
    const assetsRoot = path.resolve('./assets');
    const reqFile = path.resolve(path.normalize(req.url).slice(1));

    // Disallow to go outside of assets directory
    if (!reqFile.startsWith(assetsRoot) || !fs.existsSync(reqFile)) {
      return route.notFound(req, res);
    }
    res.setHeader('Content-Type', 'image/png');
    file = reqFile;
  } else if (req.url.endsWith('.jpg')) {
    const assetsRoot = path.resolve('./assets');
    const reqFile = path.resolve(path.normalize(req.url).slice(1));

    // Disallow to go outside of assets directory
    if (!reqFile.startsWith(assetsRoot) || !fs.existsSync(reqFile)) {
      return route.notFound(req, res);
    }
    res.setHeader('Content-Type', 'image/jpeg');
    file = reqFile;
  } else {
    return route.notFound(req, res);
  }
  if (req.url !== '/main.js' && req.url !== '/main.js.map') {
    res.setHeader('Cache-Control', 'max-age=' + assetCacheMaxAge);
  }
  readFile(file, function(err, data) {
    if (err) {
      return route.internalServerError(req, res, err);
    }
    res.setHeader('Content-Length', data.length);
    res.end(data);
  });
}

function supportsGzip(req: http.IncomingMessage): boolean {
  return req.headers['accept-encoding'] !== undefined &&
         req.headers['accept-encoding'].includes('gzip');
}

function serveStyles(req: http.IncomingMessage, res: http.ServerResponse): void {
  let buffer = styles;
  if (compressedStyles !== undefined && supportsGzip(req)) {
    res.setHeader('Content-Encoding', 'gzip');
    buffer = compressedStyles;
  }
  res.setHeader('Content-Length', buffer.length);
  res.end(buffer);
}

console.log('Starting server on port ' + (process.env.PORT || 8080));

try {
  // The first call to Database.getInstance also intiailizes a connection to the database. Better to
  // fail here than after the server opens to process requests.
  Database.getInstance();
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

