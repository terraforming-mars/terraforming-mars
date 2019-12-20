
import * as http from 'http';
import * as fs from 'fs';
import {AndOptions} from './src/inputs/AndOptions';
import {CardModel} from './src/models/CardModel';
import {Color} from './src/Color';
import {Game} from './src/Game';
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
import {SelectPlayer} from './src/inputs/SelectPlayer';
import {SelectSpace} from './src/inputs/SelectSpace';
import {SpaceModel} from './src/models/SpaceModel';
import {TileType} from './src/TileType';

const styles = fs.readFileSync('styles.css');
const nes = fs.readFileSync('nes.min.css');
const board = fs.readFileSync('board.css');
const boardPositionsCSS = fs.readFileSync('board_items_positions.css');
const gameEndCSS = fs.readFileSync('game_end.css');
const globsCSS = fs.readFileSync('globs.css');
const favicon = fs.readFileSync('favicon.ico');
const mainJs = fs.readFileSync('dist/main.js');
const prototype = fs.readFileSync('assets/Prototype.ttf');

const games: Map<string, Game> = new Map<string, Game>();
const playersToGame: Map<string, Game> = new Map<string, Game>();
const pngs: Map<string, Buffer> = new Map<string, Buffer>([
  ['/assets/tag-animal.png', fs.readFileSync('assets/tag-animal.png')],
  ['/assets/tag-building.png', fs.readFileSync('assets/tag-building.png')],
  ['/assets/tag-city.png', fs.readFileSync('assets/tag-city.png')],
  ['/assets/cursor.png', fs.readFileSync('assets/cursor.png')],
  ['/assets/cursor-click.png', fs.readFileSync('assets/cursor-click.png')],
  ['/assets/tag-earth.png', fs.readFileSync('assets/tag-earth.png')],
  ['/assets/tag-event.png', fs.readFileSync('assets/tag-event.png')],
  ['/assets/tag-jovian.png', fs.readFileSync('assets/tag-jovian.png')],
  ['/assets/tag-microbe.png', fs.readFileSync('assets/tag-microbe.png')],
  ['/assets/tag-plant.png', fs.readFileSync('assets/tag-plant.png')],
  ['/assets/tag-power.png', fs.readFileSync('assets/tag-power.png')],
  ['/assets/tag-science.png', fs.readFileSync('assets/tag-science.png')],
  ['/assets/tag-space.png', fs.readFileSync('assets/tag-space.png')],
  ['/assets/tag-wild.png', fs.readFileSync('assets/tag-wild.png')],
  ['/assets/tag-venus.png', fs.readFileSync('assets/tag-venus.png')],
  ['/assets/triangle16.png', fs.readFileSync('assets/triangle16.png')],
  ['/assets/board_icons.png', fs.readFileSync('assets/board_icons.png')],
  ['/assets/board_bg_planet.png', fs.readFileSync('assets/board_bg_planet.png')],
  ['/assets/solo_win.png', fs.readFileSync('assets/solo_win.png')],
  ['/assets/globs.png', fs.readFileSync('assets/globs.png')]
]);

function requestHandler(
    req: http.IncomingMessage,
    res: http.ServerResponse
): void {
  if (req.url !== undefined) {
    if (req.method === 'GET') {
      if (
        req.url === '/' ||
        req.url.startsWith('/game?id=') ||
        req.url.startsWith('/player?id=') ||
        req.url.startsWith('/the-end?player_id=')
      ) {
        serveApp(res);
      } else if (req.url.startsWith('/api/player?id=')) {
        apiGetPlayer(req, res);
      } else if (req.url === '/nes.min.css') {
        serveResource(res, nes);
      } else if (req.url === '/board.css') {
        serveResource(res, board);
      } else if (req.url === '/board_items_positions.css') {
        serveResource(res, boardPositionsCSS);
      } else if (req.url === '/game_end.css') {
        serveResource(res, gameEndCSS);
      } else if (req.url === '/globs.css') {
        serveResource(res, globsCSS);
      } else if (req.url === '/styles.css') {
        serveResource(res, styles);
      } else if (req.url === '/assets/Prototype.ttf') {
        serveResource(res, prototype);
      } else if (req.url === '/main.js') {
        serveResource(res, mainJs);
      } else if (pngs.has(req.url)) {
        servePng(res, pngs.get(req.url)!);
      } else if (req.url === '/favicon.ico') {
        serveFavicon(res);
      } else if (req.url.indexOf('/api/game') === 0) {
        apiGetGame(req, res);
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
    }
  } else {
    notFound(req, res);
  }
};

const server: http.Server = http.createServer(requestHandler);

function generateRandomGameId(): string {
  return Math.floor(Math.random() * Math.pow(16, 12)).toString(16);
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
      player.process(entity);
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
      const game = new Game(gameId, players, firstPlayer, gameReq.prelude);
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

function getPlayer(player: Player, game: Game): string {
  const output = {
    cardsInHand: getCards(player, player.cardsInHand, game),
    claimedMilestones: game.claimedMilestones.map((claimedMilestone) => {
      return {
        player: claimedMilestone.player.id,
        milestone: claimedMilestone.milestone.name
      };
    }),
    color: player.color,
    corporationCard: player.corporationCard ?
      player.corporationCard.name : undefined,
    energy: player.energy,
    energyProduction: player.energyProduction,
    fundedAwards: game.fundedAwards.map((fundedAward) => {
      return {player: fundedAward.player.id, award: fundedAward.award.name};
    }),
    generation: game.getGeneration(),
    heat: player.heat,
    heatProduction: player.heatProduction,
    id: player.id,
    megaCredits: player.megaCredits,
    megaCreditProduction: player.megaCreditProduction,
    name: player.name,
    oceans: game.getOceansOnBoard(),
    oxygenLevel: game.getOxygenLevel(),
    phase: game.phase,
    plants: player.plants,
    plantProduction: player.plantProduction,
    playedCards: getCards(player, player.playedCards, game),
    cardsInHandNbr: player.cardsInHand.length,
    players: getPlayers(game.getPlayers(), game),
    spaces: getSpaces(game.getAllSpaces()),
    steel: player.steel,
    steelProduction: player.steelProduction,
    steelValue: player.steelValue,
    temperature: game.getTemperature(),
    terraformRating: player.terraformRating,
    titanium: player.titanium,
    titaniumProduction: player.titaniumProduction,
    titaniumValue: player.titaniumValue,
    victoryPoints: player.victoryPoints,
    victoryPointsBreakdown: player.victoryPointsBreakdown,
    waitingFor: getWaitingFor(player.getWaitingFor()),
    gameLog: game.gameLog,
    canUseMicrobesAsMegaCreditsForPlants:
      player.canUseMicrobesAsMegaCreditsForPlants,
    isSoloModeWin: game.isSoloModeWin()
  } as PlayerModel;
  return JSON.stringify(output);
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
    max: undefined
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
      result.cards = (waitingFor as SelectCard<ICard>)
          .cards.map((card) => card.name);
      result.maxCardsToSelect = 1;
      result.minCardsToSelect = 1;
      result.canUseHeat = (waitingFor as SelectHowToPay).canUseHeat;
      break;
    case PlayerInputTypes.SELECT_CARD:
      result.cards = (waitingFor as SelectCard<ICard>)
          .cards.map((card) => card.name);
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
    calculatedCost: player.getCardCost(game, card)
  }));
}

function getPlayers(players: Array<Player>, game: Game): Array<PlayerModel> {
  return players.map((player) => {
    return {
      color: player.color,
      corporationCard: player.corporationCard ?
        player.corporationCard.name : undefined,
      energy: player.energy,
      energyProduction: player.energyProduction,
      heat: player.heat,
      heatProduction: player.heatProduction,
      id: player.id,
      megaCredits: player.megaCredits,
      megaCreditProduction: player.megaCreditProduction,
      name: player.name,
      plants: player.plants,
      plantProduction: player.plantProduction,
      playedCards: getCards(player, player.playedCards, game),
      cardsInHandNbr: player.cardsInHand.length,
      steel: player.steel,
      steelProduction: player.steelProduction,
      steelValue: player.steelValue,
      terraformRating: player.terraformRating,
      titanium: player.titanium,
      titaniumProduction: player.titaniumProduction,
      titaniumValue: player.titaniumValue,
      victoryPoints: player.victoryPoints,
      victoryPointsBreakdown: player.victoryPointsBreakdown
    } as PlayerModel;
  });
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

function serveApp(res: http.ServerResponse): void {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.write(fs.readFileSync('index.html'));
  res.end();
}

function serveFavicon(res: http.ServerResponse): void {
  res.setHeader('Content-Type', 'image/x-icon');
  res.write(favicon);
  res.end();
}

function serveResource(res: http.ServerResponse, s: Buffer): void {
  res.write(s);
  res.end();
}

function servePng(res: http.ServerResponse, s: Buffer): void {
  res.setHeader('Content-Type', 'image/png');
  res.write(s);
  res.end();
}

console.log('Starting server on port ' + (process.env.PORT || 8080));
server.listen(process.env.PORT || 8080);

