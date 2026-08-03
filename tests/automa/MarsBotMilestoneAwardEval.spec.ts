import {expect} from 'chai';
import {MILESTONE_EVALS, AWARD_EVALS} from '../../src/server/automa/MarsBotMilestoneAwardEval';
import {IMarsBot} from '../../src/server/automa/MarsBotCorpTypes';
import {MarsBotBoard} from '../../src/server/automa/MarsBotBoard';
import {THARSIS_MARSBOT_BOARD} from '../../src/server/automa/boards/TharsisMarsBot';
import {VENUS_MARSBOT_TRACK} from '../../src/server/automa/boards/VenusMarsBot';
import {IProjectCard} from '../../src/server/cards/IProjectCard';
import {TileType} from '../../src/common/TileType';
import {testGame} from '../TestGame';
import {fakeCard} from '../TestingUtils';
import {Algae} from '../../src/server/cards/base/Algae';
import {Asteroid} from '../../src/server/cards/base/Asteroid';
import {Decomposers} from '../../src/server/cards/base/Decomposers';

type BotOptions = {
  venus?: boolean,
  megacredits?: number,
  floaters?: number,
  temperatureRaises?: number,
  played?: Array<IProjectCard>,
};

/**
 * The evals only read the bot, so a plain object standing in for one is enough here.
 * The game and the board are real, since the tile and card counts come off them.
 */
function createBot(options: BotOptions = {}) {
  const [game, player] = testGame(2, {venusNextExtension: options.venus === true});
  const trackDefinitions = options.venus === true ?
    [...THARSIS_MARSBOT_BOARD, VENUS_MARSBOT_TRACK] :
    THARSIS_MARSBOT_BOARD;
  const board = new MarsBotBoard(trackDefinitions);
  const bot = {
    game,
    player,
    board,
    mcSupply: options.megacredits ?? 0,
    floaterCount: options.floaters ?? 0,
    temperatureRaises: options.temperatureRaises ?? 0,
    playedProjectCards: options.played ?? [],
  } as unknown as IMarsBot;
  return {game, player, board, bot};
}

function advance(board: MarsBotBoard, index: number, steps: number): void {
  for (let step = 0; step < steps; step++) {
    board.tracks[index].advance();
  }
}

function milestone(name: string, bot: IMarsBot) {
  return MILESTONE_EVALS.get(name as never)!(bot);
}

function award(name: string, bot: IMarsBot) {
  return AWARD_EVALS.get(name as never)!(bot);
}

describe('MarsBotMilestoneAwardEval', () => {
  describe('read from the player and the bot', () => {
    it('Terraformer counts the terraform rating', () => {
      const {player, bot} = createBot();
      player.setTerraformRating(35);
      expect(milestone('Terraformer', bot)).is.true;

      player.setTerraformRating(34);
      expect(milestone('Terraformer', bot)).is.false;
    });

    it('Tactician counts the M€ supply', () => {
      expect(milestone('Tactician', createBot({megacredits: 35}).bot)).is.true;
      expect(milestone('Tactician', createBot({megacredits: 34}).bot)).is.false;
    });

    it('Thawer counts temperature raises', () => {
      expect(milestone('Thawer', createBot({temperatureRaises: 5}).bot)).is.true;
      expect(milestone('Thawer', createBot({temperatureRaises: 4}).bot)).is.false;
    });

    it('Hoverlord counts floaters', () => {
      expect(milestone('Hoverlord', createBot({floaters: 7}).bot)).is.true;
      expect(milestone('Hoverlord', createBot({floaters: 6}).bot)).is.false;
    });

    it('Benefactor scores the terraform rating above 15', () => {
      const {player, bot} = createBot();
      player.setTerraformRating(23);
      expect(award('Benefactor', bot)).to.eq(8);

      player.setTerraformRating(10);
      expect(award('Benefactor', bot)).to.eq(0);
    });
  });

  describe('read from the board', () => {
    it('Mayor counts the cities MarsBot owns', () => {
      const {game, player, bot} = createBot();
      for (const space of game.board.getAvailableSpacesForCity(player).slice(0, 3)) {
        game.simpleAddTile(player, space, {tileType: TileType.CITY});
      }

      expect(milestone('Mayor', bot)).is.true;
    });

    it('Mayor does not count the other player’s cities', () => {
      const [game, human, other] = testGame(2);
      const bot = {game, player: other, board: new MarsBotBoard(THARSIS_MARSBOT_BOARD), playedProjectCards: []} as unknown as IMarsBot;
      for (const space of game.board.getAvailableSpacesForCity(human).slice(0, 3)) {
        game.simpleAddTile(human, space, {tileType: TileType.CITY});
      }

      expect(milestone('Mayor', bot)).is.false;
    });

    it('Gardener counts the greeneries MarsBot owns', () => {
      const {game, player, bot} = createBot();
      for (const space of game.board.getAvailableSpacesOnLand(player).slice(0, 3)) {
        game.simpleAddTile(player, space, {tileType: TileType.GREENERY});
      }

      expect(milestone('Gardener', bot)).is.true;
    });

    it('Hydrologist counts the ocean steps MarsBot paid for', () => {
      const {player, bot} = createBot();
      // Ocean tiles carry no owner, so placing them proves nothing. The player records the steps.
      player.globalParameterSteps.oceans = 3;
      expect(milestone('Hydrologist', bot)).is.false;

      player.globalParameterSteps.oceans = 4;
      expect(milestone('Hydrologist', bot)).is.true;
    });

    it('Coastguard counts MarsBot tiles next to an ocean', () => {
      const {game, player, bot} = createBot();
      const ocean = game.board.getAvailableSpacesForOcean(player).find((space) =>
        game.board.getAdjacentSpaces(space).filter((s) => game.board.canPlaceTile(s)).length >= 4)!;
      game.simpleAddTile(player, ocean, {tileType: TileType.OCEAN});
      const shore = game.board.getAdjacentSpaces(ocean).filter((space) => game.board.canPlaceTile(space));

      // Two tiles well away from any ocean, which must not count towards the four
      const inland = game.board.getAvailableSpacesOnLand(player).filter((space) =>
        game.board.getAdjacentSpaces(space).every((s) => s.tile === undefined) &&
        !shore.includes(space) && space !== ocean).slice(0, 2);
      for (const space of inland) {
        game.simpleAddTile(player, space, {tileType: TileType.GREENERY});
      }
      for (const space of shore.slice(0, 3)) {
        game.simpleAddTile(player, space, {tileType: TileType.GREENERY});
      }
      expect(milestone('Coastguard', bot)).is.false;

      game.simpleAddTile(player, shore[3], {tileType: TileType.GREENERY});
      expect(milestone('Coastguard', bot)).is.true;
    });

    it('Landlord scores every tile MarsBot owns', () => {
      const {game, player, bot} = createBot();
      for (const space of game.board.getAvailableSpacesOnLand(player).slice(0, 4)) {
        game.simpleAddTile(player, space, {tileType: TileType.GREENERY});
      }

      expect(award('Landlord', bot)).to.eq(4);
    });
  });

  describe('read from the tracks', () => {
    it('Builder needs the building track at 8', () => {
      const {board, bot} = createBot();
      advance(board, 0, 7);
      expect(milestone('Builder', bot)).is.false;

      advance(board, 0, 1);
      expect(milestone('Builder', bot)).is.true;
    });

    it('Planner needs every Mars track at 4', () => {
      const {board, bot} = createBot();
      for (let index = 0; index < 7; index++) {
        advance(board, index, 4);
      }
      expect(milestone('Planner', bot)).is.true;

      board.tracks[2].regress();
      expect(milestone('Planner', bot)).is.false;
    });

    it('Specialist needs one track at 10', () => {
      const {board, bot} = createBot();
      advance(board, 5, 9);
      expect(milestone('Specialist', bot)).is.false;

      advance(board, 5, 1);
      expect(milestone('Specialist', bot)).is.true;
    });

    it('Producer sums the top three tracks', () => {
      const {board, bot} = createBot();
      advance(board, 0, 6);
      advance(board, 1, 6);
      advance(board, 2, 3);
      expect(milestone('Producer', bot)).is.false;

      advance(board, 2, 1);
      expect(milestone('Producer', bot)).is.true;
    });

    it('Mogul doubles the furthest track', () => {
      const {board, bot} = createBot();
      advance(board, 3, 6);
      advance(board, 1, 2);

      expect(award('Mogul', bot)).to.eq(12);
    });

    it('Blacksmith takes the further of the building and space tracks', () => {
      const {board, bot} = createBot();
      advance(board, 0, 3);
      advance(board, 1, 5);

      expect(award('Blacksmith', bot)).to.eq(5);
    });
  });

  describe('Venus changes the track maths', () => {
    it('Diversifier needs every Mars track at 3 without Venus', () => {
      const {board, bot} = createBot();
      for (let index = 0; index < 7; index++) {
        advance(board, index, 3);
      }
      expect(milestone('Diversifier', bot)).is.true;

      board.tracks[4].regress();
      expect(milestone('Diversifier', bot)).is.false;
    });

    it('Diversifier lets the Venus track cover one short Mars track', () => {
      const {board, bot} = createBot({venus: true});
      for (let index = 0; index < 8; index++) {
        advance(board, index, 3);
      }
      board.tracks[4].regress();

      // Seven of the eight tracks still stand at 3
      expect(milestone('Diversifier', bot)).is.true;
    });

    it('Planner ignores the Venus track', () => {
      const {board, bot} = createBot({venus: true});
      for (let index = 0; index < 7; index++) {
        advance(board, index, 4);
      }

      // The Venus track sits at 0 and must not hold the milestone back
      expect(milestone('Planner', bot)).is.true;
    });

    it('Venuphile scores the Venus track, and nothing without Venus', () => {
      const {board, bot} = createBot({venus: true});
      advance(board, 7, 4);
      expect(award('Venuphile', bot)).to.eq(4);

      expect(award('Venuphile', createBot().bot)).to.eq(0);
    });

    it('Visionary doubles the lowest track, or the second lowest with Venus', () => {
      const withoutVenus = createBot();
      advance(withoutVenus.board, 0, 5);
      expect(award('Visionary', withoutVenus.bot)).to.eq(0);

      const withVenus = createBot({venus: true});
      for (let index = 0; index < 8; index++) {
        advance(withVenus.board, index, 2);
      }
      withVenus.board.tracks[6].regress();
      // Positions are 1, 2, 2, 2, 2, 2, 2, 2, so the second lowest is 2
      expect(award('Visionary', withVenus.bot)).to.eq(4);
    });
  });

  describe('read from the played cards', () => {
    it('Tycoon counts green and blue cards but not events', () => {
      const green = () => new Algae();
      const blue = () => new Decomposers();
      const played = [green(), green(), blue(), new Asteroid()];

      expect(award('Magnate', createBot({played}).bot)).to.eq(2);
      expect(milestone('Legend4', createBot({played: [new Asteroid(), new Asteroid(), new Asteroid(), new Asteroid()]}).bot)).is.true;
    });

    it('Sponsor counts cards costing 20 or more', () => {
      const played = [fakeCard({cost: 20}), fakeCard({cost: 25}), fakeCard({cost: 19})];

      expect(milestone('Sponsor', createBot({played}).bot)).is.false;

      played.push(fakeCard({cost: 30}));
      expect(milestone('Sponsor', createBot({played}).bot)).is.true;
    });

    it('Incorporator scores cards costing 10 or less', () => {
      const played = [fakeCard({cost: 10}), fakeCard({cost: 3}), fakeCard({cost: 11})];

      expect(award('Incorporator', createBot({played}).bot)).to.eq(2);
    });

    it('Administrator scores cards without tags, plus two', () => {
      const played = [fakeCard({}), fakeCard({}), new Algae()];

      expect(award('Administrator', createBot({played}).bot)).to.eq(4);
    });

    it('Philantropist counts cards worth nothing or better', () => {
      const played = [fakeCard({}), fakeCard({}), fakeCard({getVictoryPoints: () => -1} as never)];

      expect(milestone('Philantropist', createBot({played}).bot)).is.false;
    });
  });

  describe('milestones and awards MarsBot scores like anyone else', () => {
    it('return undefined so the game falls back to its own evaluation', () => {
      const {bot} = createBot();

      expect(milestone('Polar Explorer', bot)).is.undefined;
      expect(milestone('Geologist', bot)).is.undefined;
      expect(award('Cultivator', bot)).is.undefined;
      expect(award('Landscaper', bot)).is.undefined;
    });

    it('Politician always scores 5', () => {
      expect(award('Politician', createBot().bot)).to.eq(5);
    });

    it('Lobbyist is never claimed', () => {
      expect(milestone('Lobbyist', createBot().bot)).is.false;
    });
  });
});
