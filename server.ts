require('dotenv').config();

import * as https from 'https';
import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import * as querystring from 'querystring';
import * as zlib from 'zlib';

import {AndOptions} from './src/inputs/AndOptions';
import {BoardName} from './src/BoardName';
import {CardModel} from './src/models/CardModel';
import {ColonyModel} from './src/models/ColonyModel';
import {Color} from './src/Color';
import {Game} from './src/Game';
import {GameLoader} from './src/database/GameLoader';
import {GameLogs} from './src/routes/GameLogs';
import {GameHomeModel} from './src/models/GameHomeModel';
import {Route} from './src/routes/Route';
import {ICard} from './src/cards/ICard';
import {IProjectCard} from './src/cards/IProjectCard';
import {ISpace} from './src/ISpace';
import {OrOptions} from './src/inputs/OrOptions';
import {Player} from './src/Player';
import {PlayerInput} from './src/PlayerInput';
import {PlayerInputModel} from './src/models/PlayerInputModel';
import {PlayerInputTypes} from './src/PlayerInputTypes';
import {PlayerModel} from './src/models/PlayerModel';
import {SelectAmount} from './src/inputs/SelectAmount';
import {SelectCard} from './src/inputs/SelectCard';
import {SelectHowToPay} from './src/inputs/SelectHowToPay';
import {SelectHowToPayForCard} from './src/inputs/SelectHowToPayForCard';
import {SelectPlayer} from './src/inputs/SelectPlayer';
import {SelectSpace} from './src/inputs/SelectSpace';
import {SpaceModel} from './src/models/SpaceModel';
import {TileType} from './src/TileType';
import {Phase} from './src/Phase';
import {Resources} from './src/Resources';
import {CardType} from './src/cards/CardType';
import {
  ClaimedMilestoneModel,
  IMilestoneScore,
} from './src/models/ClaimedMilestoneModel';
import {FundedAwardModel, IAwardScore} from './src/models/FundedAwardModel';
import {Database} from './src/database/Database';
import {
  PartyModel,
  DelegatesModel,
  TurmoilModel,
} from './src/models/TurmoilModel';
import {SelectDelegate} from './src/inputs/SelectDelegate';
import {SelectColony} from './src/inputs/SelectColony';
import {SelectProductionToLose} from './src/inputs/SelectProductionToLose';
import {ShiftAresGlobalParameters} from './src/inputs/ShiftAresGlobalParameters';

const serverId = process.env.SERVER_ID || generateRandomServerId();
const styles = fs.readFileSync('styles.css');
let compressedStyles: undefined | Buffer = undefined;
const gameLoader = new GameLoader();
const route = new Route();
const gameLogs = new GameLogs(gameLoader);
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
      gameLoader.getGameByPlayerId(playerId, (game) => {
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

function generateRandomGameId(): string {
  return Math.floor(Math.random() * Math.pow(16, 12)).toString(16);
}

function generateRandomServerId(): string {
  return generateRandomGameId();
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
      player.process(game, entity);
      res.setHeader('Content-Type', 'application/json');
      res.write(getPlayer(player, game));
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
  res.write(JSON.stringify(gameLoader.getLoadedGameIds()));
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

      const player = new Player('test', Color.BLUE, false, 0);
      const player2 = new Player('test2', Color.RED, false, 0);
      const gameToRebuild = new Game(game_id, [player, player2], player);
      Database.getInstance().restoreGameLastSave(
        game_id,
        gameToRebuild,
        function(err) {
          if (err) {
            return;
          }
          gameLoader.addGame(gameToRebuild);
        },
      );
      res.setHeader('Content-Type', 'application/json');
      res.write(getGame(gameToRebuild));
      res.end();
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

  const gameId: string = matches[1];

  gameLoader.getGameByGameId(gameId, (game: Game | undefined) => {
    if (game === undefined) {
      console.warn('game is undefined');
      route.notFound(req, res);
      return;
    }

    res.setHeader('Content-Type', 'application/json');
    res.write(getGame(game));
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
  gameLoader.getGameByPlayerId(playerId, (game) => {
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
  gameLoader.getGameByPlayerId(playerId as string, (game) => {
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
    res.write(getPlayer(player, game));
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
      const gameId = generateRandomGameId();
      const players = gameReq.players.map((obj: any) => {
        return new Player(
          obj.name,
          obj.color,
          obj.beginner,
          obj.handicap,
        );
      });
      let firstPlayer = players[0];
      for (let i = 0; i < gameReq.players.length; i++) {
        if (gameReq.players[i].first === true) {
          firstPlayer = players[i];
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

      const game = new Game(gameId, players, firstPlayer, gameOptions);
      gameLoader.addGame(game);
      res.setHeader('Content-Type', 'application/json');
      res.write(getGame(game));
      res.end();
    } catch (error) {
      route.internalServerError(req, res, error);
    }
  });
}

function getMilestones(game: Game): Array<ClaimedMilestoneModel> {
  const allMilestones = game.milestones;
  const claimedMilestones = game.claimedMilestones;
  const milestoneModels: Array<ClaimedMilestoneModel> = [];

  for (const milestone of allMilestones) {
    const claimed = claimedMilestones.find(
      (m) => m.milestone.name === milestone.name,
    );
    const scores: Array<IMilestoneScore> = [];
    if (claimed === undefined && claimedMilestones.length < 3) {
      game.getPlayers().forEach((player) => {
        scores.push({
          playerColor: player.color,
          playerScore: milestone.getScore(player, game),
        });
      });
    }

    milestoneModels.push({
      player_name: claimed === undefined ? '' : claimed.player.name,
      player_color: claimed === undefined ? '' : claimed.player.color,
      milestone,
      scores,
    });
  }

  return milestoneModels;
}

function getAwards(game: Game): Array<FundedAwardModel> {
  const allAwards = game.awards;
  const fundedAwards = game.fundedAwards;
  const awardModels: Array<FundedAwardModel> = [];

  for (const award of allAwards) {
    const funded = fundedAwards.find(
      (a) => a.award.name === award.name,
    );
    const scores: Array<IAwardScore> = [];
    if (fundedAwards.length < 3 || funded !== undefined) {
      game.getPlayers().forEach((player) => {
        scores.push({
          playerColor: player.color,
          playerScore: award.getScore(player, game),
        });
      });
    }

    awardModels.push({
      player_name: funded === undefined ? '' : funded.player.name,
      player_color: funded === undefined ? '' : funded.player.color,
      award,
      scores: scores,
    });
  }

  return awardModels;
}

function getCorporationCard(player: Player): CardModel | undefined {
  if (player.corporationCard === undefined) return undefined;
  return {
    name: player.corporationCard.name,
    resources: player.getResourcesOnCard(player.corporationCard),
    calculatedCost: 0,
    cardType: CardType.CORPORATION,
    isDisabled: player.corporationCard.isDisabled,
  } as CardModel;
}

function getPlayer(player: Player, game: Game): string {
  const turmoil = getTurmoil(game);

  const output: PlayerModel = {
    cardsInHand: getCards(player, player.cardsInHand, game, false),
    draftedCards: getCards(player, player.draftedCards, game, false),
    milestones: getMilestones(game),
    awards: getAwards(game),
    cardCost: player.cardCost,
    color: player.color,
    corporationCard: getCorporationCard(player),
    energy: player.energy,
    energyProduction: player.getProduction(Resources.ENERGY),
    generation: game.getGeneration(),
    heat: player.heat,
    heatProduction: player.getProduction(Resources.HEAT),
    id: player.id,
    megaCredits: player.megaCredits,
    megaCreditProduction: player.getProduction(Resources.MEGACREDITS),
    name: player.name,
    oceans: game.board.getOceansOnBoard(),
    oxygenLevel: game.getOxygenLevel(),
    phase: game.phase,
    plants: player.plants,
    plantProduction: player.getProduction(Resources.PLANTS),
    playedCards: getCards(player, player.playedCards, game),
    cardsInHandNbr: player.cardsInHand.length,
    citiesCount: player.getCitiesCount(game),
    coloniesCount: player.getColoniesCount(game),
    noTagsCount: player.getNoTagsCount(),
    influence: turmoil ? game.turmoil!.getPlayerInfluence(player) : 0,
    coloniesExtension: game.gameOptions.coloniesExtension,
    players: getPlayers(game.getPlayers(), game),
    spaces: getSpaces(game.board.spaces),
    steel: player.steel,
    steelProduction: player.getProduction(Resources.STEEL),
    steelValue: player.getSteelValue(game),
    temperature: game.getTemperature(),
    terraformRating: player.getTerraformRating(),
    titanium: player.titanium,
    titaniumProduction: player.getProduction(Resources.TITANIUM),
    titaniumValue: player.getTitaniumValue(game),
    victoryPointsBreakdown: player.getVictoryPoints(game),
    waitingFor: getWaitingFor(player.getWaitingFor()),
    isSoloModeWin: game.isSoloModeWin(),
    gameAge: game.gameAge,
    isActive: player.id === game.activePlayer,
    corporateEra: game.gameOptions.corporateEra,
    venusNextExtension: game.gameOptions.venusNextExtension,
    venusScaleLevel: game.getVenusScaleLevel(),
    boardName: game.gameOptions.boardName,
    colonies: getColonies(game),
    tags: player.getAllTags(),
    showOtherPlayersVP: game.gameOptions.showOtherPlayersVP,
    actionsThisGeneration: Array.from(player.getActionsThisGeneration()),
    fleetSize: player.getFleetSize(),
    tradesThisTurn: player.tradesThisTurn,
    turmoil: turmoil,
    selfReplicatingRobotsCards: player.getSelfReplicatingRobotsCards(game),
    dealtCorporationCards: player.dealtCorporationCards,
    dealtPreludeCards: player.dealtPreludeCards,
    dealtProjectCards: player.dealtProjectCards,
    initialDraft: game.gameOptions.initialDraftVariant,
    needsToDraft: player.needsToDraft,
    deckSize: game.dealer.getDeckSize(),
    randomMA: game.gameOptions.randomMA,
    actionsTakenThisRound: player.actionsTakenThisRound,
    passedPlayers: game.getPassedPlayers(),
    aresExtension: game.gameOptions.aresExtension,
    aresData: game.aresData,
    preludeExtension: game.gameOptions.preludeExtension,
    politicalAgendasExtension: game.gameOptions.politicalAgendasExtension,
  };
  return JSON.stringify(output);
}

function getCardsAsCardModel(
  cards: Array<ICard>,
  showResouces: boolean = true,
): Array<CardModel> {
  const result: Array<CardModel> = [];
  cards.forEach((card) => {
    result.push({
      name: card.name,
      resources:
        card.resourceCount !== undefined && showResouces ?
          card.resourceCount :
          undefined,
      resourceType: card.resourceType,
      calculatedCost: 0,
      cardType: CardType.AUTOMATED,
      isDisabled: false,
    });
  });

  return result;
}

function getWaitingFor(
  waitingFor: PlayerInput | undefined,
): PlayerInputModel | undefined {
  if (waitingFor === undefined) {
    return undefined;
  }
  const result: PlayerInputModel = {
    title: waitingFor.title,
    buttonLabel: waitingFor.buttonLabel,
    inputType: waitingFor.inputType,
    amount: undefined,
    options: undefined,
    cards: undefined,
    maxCardsToSelect: undefined,
    minCardsToSelect: undefined,
    canUseSteel: undefined,
    canUseTitanium: undefined,
    canUseHeat: undefined,
    players: undefined,
    availableSpaces: undefined,
    max: undefined,
    microbes: undefined,
    floaters: undefined,
    coloniesModel: undefined,
    payProduction: undefined,
    aresData: undefined,
  };
  switch (waitingFor.inputType) {
  case PlayerInputTypes.AND_OPTIONS:
  case PlayerInputTypes.OR_OPTIONS:
    result.options = [];
    for (const option of (waitingFor as AndOptions | OrOptions)
      .options) {
      const subOption = getWaitingFor(option);
      if (subOption !== undefined) {
        result.options.push(subOption);
      }
    }
    break;
  case PlayerInputTypes.SELECT_HOW_TO_PAY_FOR_CARD:
    result.cards = getCardsAsCardModel(
      (waitingFor as SelectHowToPayForCard).cards,
      false,
    );
    result.microbes = (waitingFor as SelectHowToPayForCard).microbes;
    result.floaters = (waitingFor as SelectHowToPayForCard).floaters;
    result.canUseHeat = (waitingFor as SelectHowToPayForCard).canUseHeat;
    break;
  case PlayerInputTypes.SELECT_CARD:
    result.cards = getCardsAsCardModel(
      (waitingFor as SelectCard<ICard>).cards,
    );
    result.maxCardsToSelect = (waitingFor as SelectCard<
        ICard
      >).maxCardsToSelect;
    result.minCardsToSelect = (waitingFor as SelectCard<
        ICard
      >).minCardsToSelect;
    break;
  case PlayerInputTypes.SELECT_COLONY:
    result.coloniesModel = (waitingFor as SelectColony).coloniesModel;
    break;
  case PlayerInputTypes.SELECT_HOW_TO_PAY:
    result.amount = (waitingFor as SelectHowToPay).amount;
    result.canUseSteel = (waitingFor as SelectHowToPay).canUseSteel;
    result.canUseTitanium = (waitingFor as SelectHowToPay).canUseTitanium;
    result.canUseHeat = (waitingFor as SelectHowToPay).canUseHeat;
    break;
  case PlayerInputTypes.SELECT_PLAYER:
    result.players = (waitingFor as SelectPlayer).players.map(
      (player) => player.color,
    );
    break;
  case PlayerInputTypes.SELECT_SPACE:
    result.availableSpaces = (waitingFor as SelectSpace).availableSpaces.map(
      (space) => space.id,
    );
    break;
  case PlayerInputTypes.SELECT_AMOUNT:
    result.max = (waitingFor as SelectAmount).max;
    break;
  case PlayerInputTypes.SELECT_DELEGATE:
    result.players = (waitingFor as SelectDelegate).players.map(
      (player) => {
        if (player === 'NEUTRAL') {
          return 'NEUTRAL';
        } else {
          return player.color;
        }
      },
    );
    break;
  case PlayerInputTypes.SELECT_PRODUCTION_TO_LOSE:
    const _player = (waitingFor as SelectProductionToLose).player;
    result.payProduction = {
      cost: (waitingFor as SelectProductionToLose).unitsToLose,
      units: {
        megacredits: _player.getProduction(Resources.MEGACREDITS),
        steel: _player.getProduction(Resources.STEEL),
        titanium: _player.getProduction(Resources.TITANIUM),
        plants: _player.getProduction(Resources.PLANTS),
        energy: _player.getProduction(Resources.ENERGY),
        heat: _player.getProduction(Resources.HEAT),
      },
    };
    break;
  case PlayerInputTypes.SHIFT_ARES_GLOBAL_PARAMETERS:
    result.aresData = (waitingFor as ShiftAresGlobalParameters).aresData;
    break;
  }
  return result;
}

function getCards(
  player: Player,
  cards: Array<IProjectCard>,
  game: Game,
  showResouces: boolean = true,
): Array<CardModel> {
  return cards.map((card) => ({
    resources: showResouces ? player.getResourcesOnCard(card) : undefined,
    resourceType: card.resourceType,
    name: card.name,
    calculatedCost: player.getCardCost(game, card),
    cardType: card.cardType,
    isDisabled: false,
  }));
}

function getPlayers(players: Array<Player>, game: Game): Array<PlayerModel> {
  const turmoil = getTurmoil(game);

  return players.map((player) => {
    return {
      color: player.color,
      corporationCard: getCorporationCard(player),
      energy: player.energy,
      energyProduction: player.getProduction(Resources.ENERGY),
      heat: player.heat,
      heatProduction: player.getProduction(Resources.HEAT),
      id: game.phase === Phase.END ? player.id : player.color,
      megaCredits: player.megaCredits,
      megaCreditProduction: player.getProduction(Resources.MEGACREDITS),
      name: player.name,
      plants: player.plants,
      plantProduction: player.getProduction(Resources.PLANTS),
      playedCards: getCards(player, player.playedCards, game),
      cardsInHandNbr: player.cardsInHand.length,
      citiesCount: player.getCitiesCount(game),
      coloniesCount: player.getColoniesCount(game),
      noTagsCount: player.getNoTagsCount(),
      influence: turmoil ? game.turmoil!.getPlayerInfluence(player) : 0,
      coloniesExtension: game.gameOptions.coloniesExtension,
      steel: player.steel,
      steelProduction: player.getProduction(Resources.STEEL),
      steelValue: player.getSteelValue(game),
      terraformRating: player.getTerraformRating(),
      titanium: player.titanium,
      titaniumProduction: player.getProduction(Resources.TITANIUM),
      titaniumValue: player.getTitaniumValue(game),
      victoryPointsBreakdown: player.getVictoryPoints(game),
      isActive: player.id === game.activePlayer,
      venusNextExtension: game.gameOptions.venusNextExtension,
      venusScaleLevel: game.getVenusScaleLevel(),
      boardName: game.gameOptions.boardName,
      colonies: getColonies(game),
      tags: player.getAllTags(),
      showOtherPlayersVP: game.gameOptions.showOtherPlayersVP,
      actionsThisGeneration: Array.from(
        player.getActionsThisGeneration(),
      ),
      fleetSize: player.getFleetSize(),
      tradesThisTurn: player.tradesThisTurn,
      turmoil: turmoil,
      selfReplicatingRobotsCards: player.getSelfReplicatingRobotsCards(
        game,
      ),
      needsToDraft: player.needsToDraft,
      deckSize: game.dealer.getDeckSize(),
      actionsTakenThisRound: player.actionsTakenThisRound,
      preludeExtension: game.gameOptions.preludeExtension,
      politicalAgendasExtension: game.gameOptions.politicalAgendasExtension,
    } as PlayerModel;
  });
}

function getColonies(game: Game): Array<ColonyModel> {
  return game.colonies.map(
    (colony): ColonyModel => ({
      colonies: colony.colonies.map(
        (playerId): Color => game.getPlayerById(playerId).color,
      ),
      isActive: colony.isActive,
      name: colony.name,
      trackPosition: colony.trackPosition,
      visitor:
          colony.visitor === undefined ?
            undefined :
            game.getPlayerById(colony.visitor).color,
    }),
  );
}

function getTurmoil(game: Game): TurmoilModel | undefined {
  if (game.gameOptions.turmoilExtension && game.turmoil) {
    const parties = getParties(game);
    let chairman; let dominant; let ruling;
    if (game.turmoil.chairman) {
      if (game.turmoil.chairman === 'NEUTRAL') {
        chairman = Color.NEUTRAL;
      } else {
        chairman = game.getPlayerById(game.turmoil.chairman).color;
      }
    }
    if (game.turmoil.dominantParty) {
      dominant = game.turmoil.dominantParty.name;
    }
    if (game.turmoil.rulingParty) {
      ruling = game.turmoil.rulingParty.name;
    }

    const lobby = Array.from(
      game.turmoil.lobby,
      (player) => game.getPlayerById(player).color,
    );

    const reserve = game.turmoil.getPresentPlayers().map((player) => {
      const number = game.turmoil!.getDelegates(player);
      if (player !== 'NEUTRAL') {
        return {
          color: game.getPlayerById(player).color,
          number: number,
        };
      } else {
        return {color: Color.NEUTRAL, number: number};
      }
    });

    let distant;
    if (game.turmoil.distantGlobalEvent) {
      distant = {
        name: game.turmoil.distantGlobalEvent.name,
        description: game.turmoil.distantGlobalEvent.description,
        revealed: game.turmoil.distantGlobalEvent.revealedDelegate,
        current: game.turmoil.distantGlobalEvent.currentDelegate,
      };
    }

    let comming;
    if (game.turmoil.commingGlobalEvent) {
      comming = {
        name: game.turmoil.commingGlobalEvent.name,
        description: game.turmoil.commingGlobalEvent.description,
        revealed: game.turmoil.commingGlobalEvent.revealedDelegate,
        current: game.turmoil.commingGlobalEvent.currentDelegate,
      };
    }

    let current;
    if (game.turmoil.currentGlobalEvent) {
      current = {
        name: game.turmoil.currentGlobalEvent.name,
        description: game.turmoil.currentGlobalEvent.description,
        revealed: game.turmoil.currentGlobalEvent.revealedDelegate,
        current: game.turmoil.currentGlobalEvent.currentDelegate,
      };
    }

    return {
      chairman: chairman,
      ruling: ruling,
      dominant: dominant,
      parties: parties,
      lobby: lobby,
      reserve: reserve,
      distant: distant,
      comming: comming,
      current: current,
    };
  } else {
    return undefined;
  }
}

function getParties(game: Game): Array<PartyModel> {
  if (game.gameOptions.turmoilExtension && game.turmoil) {
    return game.turmoil.parties.map(function(party) {
      const delegates: Array<DelegatesModel> = [];
      party.getPresentPlayers().forEach((player) => {
        const number = party.getDelegates(player);
        if (player !== 'NEUTRAL') {
          delegates.push({
            color: game.getPlayerById(player).color,
            number: number,
          });
        } else {
          delegates.push({color: Color.NEUTRAL, number: number});
        }
      });
      let partyLeader;
      if (party.partyLeader) {
        if (party.partyLeader === 'NEUTRAL') {
          partyLeader = Color.NEUTRAL;
        } else {
          partyLeader = game.getPlayerById(party.partyLeader).color;
        }
      }
      return {
        name: party.name,
        description: party.description,
        partyLeader: partyLeader,
        delegates: delegates,
      };
    });
  }
  return [];
}

// Oceans can't be owned so they shouldn't have a color associated with them
// Land claim can have a color on a space without a tile
function getColor(space: ISpace): Color | undefined {
  if (
    (space.tile === undefined || space.tile.tileType !== TileType.OCEAN) &&
    space.player !== undefined
  ) {
    return space.player.color;
  }
  if (space.tile?.protectedHazard === true) {
    return Color.BRONZE;
  }
  return undefined;
}

function getSpaces(spaces: Array<ISpace>): Array<SpaceModel> {
  return spaces.map((space) => {
    return {
      x: space.x,
      y: space.y,
      id: space.id,
      bonus: space.bonus,
      spaceType: space.spaceType,
      tileType: space.tile && space.tile.tileType,
      color: getColor(space),
    };
  });
}

function getGame(game: Game): string {
  const output: GameHomeModel = {
    activePlayer: game.getPlayerById(game.activePlayer).color,
    id: game.id,
    phase: game.phase,
    players: game.getPlayers().map((player) => ({
      color: player.color,
      id: player.id,
      name: player.name,
    })),
  };
  return JSON.stringify(output);
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

gameLoader.start(() => {
  console.log('Starting server on port ' + (process.env.PORT || 8080));
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
});
