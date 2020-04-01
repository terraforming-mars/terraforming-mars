
import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import * as querystring from 'querystring';
import {AndOptions} from './src/inputs/AndOptions';
import { CardModel } from './src/models/CardModel';
import {ColonyModel} from './src/models/ColonyModel';
import {Color} from './src/Color';
import {
    ALL_CORPORATION_CARDS,
    ALL_PRELUDE_CORPORATIONS,
    ALL_COLONIES_CORPORATIONS,
    ALL_VENUS_CORPORATIONS,
    ALL_TURMOIL_CORPORATIONS,
    ALL_PROMO_CORPORATIONS
} from './src/Dealer';
import { Game, GameOptions } from './src/Game';
import {ICard} from './src/cards/ICard';
import {IColony} from './src/colonies/Colony';
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
import { Phase } from './src/Phase';
import { Resources } from "./src/Resources";
import { CardType } from './src/cards/CardType';
import { CardName } from "./src/CardName";
import { ClaimedMilestoneModel } from "./src/models/ClaimedMilestoneModel";
import { FundedAwardModel } from "./src/models/FundedAwardModel";

const serverId = generateRandomServerId();
const styles = fs.readFileSync('styles.css');
const games: Map<string, Game> = new Map<string, Game>();
const playersToGame: Map<string, Game> = new Map<string, Game>();
const allCorporationCards: Array<CardName> = ALL_CORPORATION_CARDS.map((cardFactory): CardName => cardFactory.cardName).concat(
    ALL_PRELUDE_CORPORATIONS.map((cardFactory): CardName => cardFactory.cardName),
    ALL_COLONIES_CORPORATIONS.map((cardFactory): CardName => cardFactory.cardName),
    ALL_VENUS_CORPORATIONS.map((cardFactory): CardName => cardFactory.cardName),
    ALL_TURMOIL_CORPORATIONS.map((cardFactory): CardName => cardFactory.cardName),
    ALL_PROMO_CORPORATIONS.map((cardFactory): CardName => cardFactory.cardName)
);
function requestHandler(
    req: http.IncomingMessage,
    res: http.ServerResponse
): void {
  if (req.url !== undefined) {
    if (req.method === 'GET') {
      if (req.url.replace(/\?.*$/, '').startsWith('/games-overview')) {
        if (!isServerIdValid(req)) {
          notAuthorized(req, res);
          return;
        } else {
          serveApp(res);
        }
      } else if (
        req.url === '/' ||
        req.url.startsWith('/game?id=') ||
        req.url.startsWith('/player?id=') ||
        req.url.startsWith('/the-end?player_id=')
      ) {
        serveApp(res);
      } else if (req.url.startsWith('/api/player?id=')) {
        apiGetPlayer(req, res);
      } else if (req.url.startsWith('/api/waitingfor?id=')) {
        apiGetWaitingFor(req, res);
      } else if (req.url.startsWith("/assets/translations.json")) {
        res.setHeader('Content-Type', 'application/json');
        res.write(fs.readFileSync("assets/translations.json"));
        res.end();
      } else if (req.url === '/styles.css') {
        res.setHeader('Content-Type', 'text/css');
        serveResource(res, styles);
      } else if (
          req.url.startsWith('/assets/') ||
          req.url === '/favicon.ico' ||
          req.url === '/main.js'
      ) {
        serveAsset(req, res);
      } else if (req.url.startsWith('/api/games')) {
        apiGetGames(req, res);
      } else if (req.url.indexOf('/api/game') === 0) {
        apiGetGame(req, res);
      } else {
        notFound(req, res);
      }
    } else if (req.method === 'PUT' && req.url.indexOf('/game') === 0) {
      createGame(req, res);
    } else if (
      req.method === 'POST' &&
      req.url.indexOf('/player/input?id=') === 0
    ) {
      const playerId: string = req.url.substring('/player/input?id='.length);
      const game = playersToGame.get(playerId);
      if (game === undefined) {
        notFound(req, res);
        return;
      }
      const player = game.getPlayers().find((p) => p.id === playerId);
      if (player === undefined) {
        notFound(req, res);
        return;
      }
      processInput(req, res, player, game);
    } else {
      notFound(req, res);
    }
  } else {
    notFound(req, res);
  }
};

const server: http.Server = http.createServer(requestHandler);

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
    game: Game
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
        'Content-Type': 'application/json'
      });
      console.warn('Error processing input from player', err);
      res.write(JSON.stringify({
        message: err.message
      }));
      res.end();
    }
  });
}

function apiGetGames(req: http.IncomingMessage, res: http.ServerResponse): void {

  if (!isServerIdValid(req)) {
    notAuthorized(req, res);
    return;
  }

  if (games === undefined) {
    notFound(req, res);
    return;
  }

  const answer: Array<string> = [];

  for (let key of Array.from(games.keys())) {
    answer.push(key);
  }

  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify(answer));
  res.end();

}

function apiGetGame(req: http.IncomingMessage, res: http.ServerResponse): void {
  const routeRegExp: RegExp = /^\/api\/game\?id\=([0-9abcdef]+)$/i;

  if (req.url === undefined) {
    console.warn('url not defined');
    notFound(req, res);
    return;
  }

  if (!routeRegExp.test(req.url)) {
    console.warn('no match with regexp');
    notFound(req, res);
    return;
  }

  const matches = req.url.match(routeRegExp);

  if (matches === null || matches[1] === undefined) {
    console.warn('didn\'t find game id');
    notFound(req, res);
    return;
  }

  const gameId: string = matches[1];

  const game = games.get(gameId);

  if (game === undefined) {
    console.warn('game is undefined');
    notFound(req, res);
    return;
  }

  res.setHeader('Content-Type', 'application/json');
  res.write(getGame(game));
  res.end();
}

function apiGetWaitingFor(
  req: http.IncomingMessage,
  res: http.ServerResponse
): void {
  const qs: string = req.url!.substring('/api/waitingfor?'.length);
  let queryParams = querystring.parse(qs);
  const playerId = (queryParams as any)['id'];
  const prevGameAge = parseInt((queryParams as any)['prev-game-age']);
  const game = playersToGame.get(playerId);
  if (game === undefined) {
    notFound(req, res);
    return;
  }
  const player = game.getPlayers().find((player) => player.id === playerId);
  if (player === undefined) {
    notFound(req, res);
    return;
  }

  res.setHeader('Content-Type', 'application/json');
  const answer = {
    "result": "WAIT",
    "player": game.activePlayer.name
  }
  if (player.getWaitingFor() !== undefined || game.phase === Phase.END) {
    answer["result"] = "GO";
  } else if (game.gameAge > prevGameAge) {
    answer["result"] = "REFRESH";
  }
  res.write(JSON.stringify(answer));
  res.end();
}

function apiGetPlayer(
    req: http.IncomingMessage,
    res: http.ServerResponse
): void {
  const playerId: string = req.url!.substring('/api/player?id='.length);
  const game = playersToGame.get(playerId);
  if (game === undefined) {
    notFound(req, res);
    return;
  }
  const player = game.getPlayers().find((player) => player.id === playerId);
  if (player === undefined) {
    notFound(req, res);
    return;
  }

  res.setHeader('Content-Type', 'application/json');
  res.write(getPlayer(player, game));
  res.end();
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
        return new Player(obj.name, obj.color, obj.beginner);
      });
      let firstPlayer = players[0];
      for (let i = 0; i < gameReq.players.length; i++) {
        if (gameReq.players[i].first === true) {
          firstPlayer = players[i];
          break;
        }
      }
      const selectedCorporations: Array<CardName> = [];
      for (let corp of (gameReq.corporations as Array<CardName>)) {
        const foundCard: CardName | undefined = allCorporationCards.find((cardName) => cardName === corp);
        if (foundCard !== undefined) {
          selectedCorporations.push(foundCard);
        } else {
          throw new Error("Custom corporation card " + corp + " not found");
        }
      }

      const gameOptions = {
        draftVariant: gameReq.draftVariant,
        preludeExtension: gameReq.prelude,
        venusNextExtension: gameReq.venusNext,
        coloniesExtension: gameReq.colonies,
        boardName: gameReq.board,
        showOtherPlayersVP: gameReq.showOtherPlayersVP,
        customCorporationsList: gameReq.customCorporationsList,
        corporations: selectedCorporations
      } as GameOptions;

      const game = new Game(gameId, players, firstPlayer, gameOptions);
      games.set(gameId, game);
      game.getPlayers().forEach((player) => {
        playersToGame.set(player.id, game);
      });
      res.setHeader('Content-Type', 'application/json');
      res.write(getGame(game));
    } catch (err) {
      console.warn('error creating game', err);
      res.writeHead(500);
      res.write('Unable to create game');
    }
    res.end();
  });
}

function getMilestones(game: Game): Array<ClaimedMilestoneModel> {
  const allMilestones = game.milestones;
  const claimedMilestones = game.claimedMilestones;
  let milestoneModels: Array<ClaimedMilestoneModel> = [];

  for (let idx in allMilestones) {
    let claimed = claimedMilestones.find((m) => m.milestone.name === allMilestones[idx].name)
    milestoneModels.push({
      player_name: claimed === undefined ? "": claimed.player.name,
      player_color: claimed === undefined ? "": claimed.player.color,
      milestone: allMilestones[idx]
    })
  }
  
  return milestoneModels;
}

function getAwards(game: Game): Array<FundedAwardModel>  {
  const allAwards = game.awards;
  const fundedAwards = game.fundedAwards;
  let awardModels: Array<FundedAwardModel> = [];

  for (let idx in allAwards) {
    let funded = fundedAwards.find((a) => a.award.name === allAwards[idx].name)
    awardModels.push({
      player_name: funded === undefined ? "": funded.player.name,
      player_color: funded === undefined ?  "": funded.player.color,
      award: allAwards[idx]
    })
  }
  
  return awardModels;
}

function getPlayer(player: Player, game: Game): string {
  const output = {
    cardsInHand: getCards(player, player.cardsInHand, game),
    draftedCards: getCards(player, player.draftedCards, game),
    milestones: getMilestones(game),
    awards: getAwards(game),
    color: player.color,
    corporationCard: player.corporationCard ?
      player.corporationCard.name : undefined,
    corporationCardResources: player.corporationCard ?
      player.getResourcesOnCard(player.corporationCard) : undefined,  
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
    players: getPlayers(game.getPlayers(), game),
    spaces: getSpaces(game.board.spaces),
    steel: player.steel,
    steelProduction: player.getProduction(Resources.STEEL),
    steelValue: player.steelValue,
    temperature: game.getTemperature(),
    terraformRating: player.terraformRating,
    titanium: player.titanium,
    titaniumProduction: player.getProduction(Resources.TITANIUM),
    titaniumValue: player.titaniumValue,
    victoryPointsBreakdown: player.getVictoryPoints(game),
    waitingFor: getWaitingFor(player.getWaitingFor()),
    gameLog: game.gameLog,
    isSoloModeWin: game.isSoloModeWin(),
    gameAge: game.gameAge,
    isActive: player.id === game.activePlayer.id,
    venusNextExtension: game.venusNextExtension,
    venusScaleLevel: game.getVenusScaleLevel(),
    boardName: game.boardName,
    colonies: getColonies(game.colonies),
    tags: player.getAllTags(),
    showOtherPlayersVP: game.showOtherPlayersVP,
    actionsThisGeneration: Array.from(player.getActionsThisGeneration())
  } as PlayerModel;
  return JSON.stringify(output);
}

function getCardsAsCardModel(cards: Array<ICard>): Array<CardModel> {
  let result:Array<CardModel> = [];

  cards.forEach((card) => {
    result.push({name: card.name, resources: (card.resourceCount !== undefined ? card.resourceCount : 0), calculatedCost : 0, cardType : CardType.AUTOMATED});
  });

  return result;
}

function getWaitingFor(
    waitingFor: PlayerInput | undefined
): PlayerInputModel | undefined {
  if (waitingFor === undefined) {
    return undefined;
  }
  const result: PlayerInputModel = {
    title: waitingFor.title,
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
    floaters: undefined
  };
  switch (waitingFor.inputType) {
    case PlayerInputTypes.AND_OPTIONS:
    case PlayerInputTypes.OR_OPTIONS:
      result.options = [];
      for (const option of (waitingFor as AndOptions | OrOptions).options) {
        const subOption = getWaitingFor(option);
        if (subOption !== undefined) {
          result.options.push(subOption);
        }
      }
      break;
    case PlayerInputTypes.SELECT_HOW_TO_PAY_FOR_CARD:
      result.cards = getCardsAsCardModel((waitingFor as SelectHowToPayForCard).cards);
      result.microbes = (waitingFor as SelectHowToPayForCard).microbes;
      result.floaters = (waitingFor as SelectHowToPayForCard).floaters;
      result.canUseHeat = (waitingFor as SelectHowToPayForCard).canUseHeat;
      break;
    case PlayerInputTypes.SELECT_CARD:
      result.cards = getCardsAsCardModel((waitingFor as SelectCard<ICard>).cards);
      result.maxCardsToSelect = (waitingFor as SelectCard<ICard>)
          .maxCardsToSelect;
      result.minCardsToSelect = (waitingFor as SelectCard<ICard>)
          .minCardsToSelect;
      break;
    case PlayerInputTypes.SELECT_HOW_TO_PAY:
      result.amount = (waitingFor as SelectHowToPay).amount;
      result.canUseSteel = (waitingFor as SelectHowToPay).canUseSteel;
      result.canUseTitanium = (waitingFor as SelectHowToPay).canUseTitanium;
      result.canUseHeat = (waitingFor as SelectHowToPay).canUseHeat;
      break;
    case PlayerInputTypes.SELECT_PLAYER:
      result.players = (waitingFor as SelectPlayer)
          .players.map((player) => player.id);
      break;
    case PlayerInputTypes.SELECT_SPACE:
      result.availableSpaces = (waitingFor as SelectSpace)
          .availableSpaces.map((space) => space.id);
      break;
    case PlayerInputTypes.SELECT_AMOUNT:
      result.max = (waitingFor as SelectAmount).max;
      break;
  }
  return result;
}

function getCards(
    player: Player,
    cards: Array<IProjectCard>,
    game: Game
): Array<CardModel> {
  return cards.map((card) => ({
    resources: player.getResourcesOnCard(card),
    name: card.name,
    calculatedCost: player.getCardCost(game, card),
    cardType: card.cardType
  }));
}

function getPlayers(players: Array<Player>, game: Game): Array<PlayerModel> {
  return players.map((player) => {
    return {
      color: player.color,
      corporationCard: player.corporationCard ?
        player.corporationCard.name : undefined,
      corporationCardResources: player.corporationCard ?
        player.getResourcesOnCard(player.corporationCard) : undefined,  
      energy: player.energy,
      energyProduction: player.getProduction(Resources.ENERGY),
      heat: player.heat,
      heatProduction: player.getProduction(Resources.HEAT),
      id: player.id,
      megaCredits: player.megaCredits,
      megaCreditProduction: player.getProduction(Resources.MEGACREDITS),
      name: player.name,
      plants: player.plants,
      plantProduction: player.getProduction(Resources.PLANTS),
      playedCards: getCards(player, player.playedCards, game),
      cardsInHandNbr: player.cardsInHand.length,
      steel: player.steel,
      steelProduction: player.getProduction(Resources.STEEL),
      steelValue: player.steelValue,
      terraformRating: player.terraformRating,
      titanium: player.titanium,
      titaniumProduction: player.getProduction(Resources.TITANIUM),
      titaniumValue: player.titaniumValue,
      victoryPointsBreakdown: player.getVictoryPoints(game),
      isActive: player.id === game.activePlayer.id,
      venusNextExtension: game.venusNextExtension,
      venusScaleLevel: game.getVenusScaleLevel(),
      boardName: game.boardName,
      colonies: getColonies(game.colonies),
      tags: player.getAllTags(),
      showOtherPlayersVP: game.showOtherPlayersVP,
      actionsThisGeneration: Array.from(player.getActionsThisGeneration())
    } as PlayerModel;
  });
}

function getColonies(colonies: Array<IColony>): Array<ColonyModel> {
    return colonies.map((colony): ColonyModel => ({
        colonies: colony.colonies.map((player): Color => player.color),
        isActive: colony.isActive,
        name: colony.name,
        trackPosition: colony.trackPosition,
        visitor: colony.visitor === undefined ? undefined : colony.visitor.color
    }));
}

// Oceans can't be owned so they shouldn't have a color associated with them
// Land claim can have a color on a space without a tile
function getColor(space: ISpace): Color | undefined {
  if (
    (space.tile === undefined || space.tile.tileType !== TileType.OCEAN) &&
    space.player !== undefined) {
    return space.player.color;
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
      color: getColor(space)
    };
  });
}

function getGame(game: Game): string {
  const output = {
    activePlayer: game.activePlayer.color,
    id: game.id,
    phase: game.phase,
    players: game.getPlayers()
  };
  return JSON.stringify(output);
}

function notFound(req: http.IncomingMessage, res: http.ServerResponse): void {
  console.warn('Not found', req.method, req.url);
  res.writeHead(404);
  res.write('Not found');
  res.end();
}

function notAuthorized(req: http.IncomingMessage, res: http.ServerResponse): void {
  console.warn('Not authorized', req.method, req.url);
  res.writeHead(403);
  res.write('Not authorized');
  res.end();
}

function isServerIdValid (req: http.IncomingMessage): boolean {
  const queryParams = querystring.parse(req.url!.replace(/^.*\?/, ''));
  if (queryParams.serverId === undefined || queryParams.serverId !== serverId) {
    console.warn('No or invalid serverId given');
    return false;
  }
  return true;
}

function serveApp(res: http.ServerResponse): void {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.write(fs.readFileSync('index.html'));
  res.end();
}

function serveAsset(req: http.IncomingMessage, res: http.ServerResponse): void {
  if (req.url === undefined) throw new Error("Empty url");

  if (req.url === '/favicon.ico') {
    res.setHeader('Content-Type', 'image/x-icon');
    res.write(fs.readFileSync('favicon.ico'));
  } else if (req.url === '/main.js') {
    res.setHeader('Content-Type', 'text/javascript');
    res.write(fs.readFileSync('dist/main.js'));
  } else if (req.url === '/assets/Prototype.ttf') {
    res.write(fs.readFileSync('assets/Prototype.ttf'));
  } else if (req.url === '/assets/futureforces.ttf') {
    res.write(fs.readFileSync('assets/futureforces.ttf'));
  } else if (req.url.endsWith('.png')) {
    const assetsRoot = path.resolve('./assets');
    const reqFile = path.resolve(path.normalize(req.url).slice(1));

    // Disallow to go outside of assets directory
    if ( ! reqFile.startsWith(assetsRoot) || ! fs.existsSync(reqFile)) {
      return notFound(req, res);
    }
    res.setHeader('Content-Type', 'image/png');
    res.write(fs.readFileSync(reqFile))
  } else if (req.url.endsWith('.jpg') ) {
    const assetsRoot = path.resolve('./assets');
    const reqFile = path.resolve(path.normalize(req.url).slice(1));

    // Disallow to go outside of assets directory
    if ( ! reqFile.startsWith(assetsRoot) || ! fs.existsSync(reqFile)) {
      return notFound(req, res);
    }
    res.setHeader('Content-Type', 'image/jpeg');
    res.write(fs.readFileSync(reqFile))
  }

  res.end()
}

function serveResource(res: http.ServerResponse, s: Buffer): void {
  res.write(s);
  res.end();
}

console.log('Starting server on port ' + (process.env.PORT || 8080));
console.log('version 0.X');

server.listen(process.env.PORT || 8080);

console.log('\nThe secret serverId for this server is \x1b[1m'+serverId+'\x1b[0m. Use it to access the following administrative routes:\n');
console.log('* Overview of existing games: /games-overview?serverId='+serverId);
console.log('* API for game IDs: /api/games?serverId='+serverId+'\n');
