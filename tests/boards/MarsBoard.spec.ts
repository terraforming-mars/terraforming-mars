import {expect} from 'chai';
import {TharsisBoard} from '../../src/server/boards/TharsisBoard';
import {TileType} from '../../src/common/TileType';
import {SpaceType} from '../../src/common/boards/SpaceType';
import {TestPlayer} from '../TestPlayer';
import {MarsBoard} from '../../src/server/boards/MarsBoard';
import {SeededRandom} from '../../src/common/utils/Random';
import {DEFAULT_GAME_OPTIONS, GameOptions} from '../../src/server/game/GameOptions';
import {ArcadianCommunities} from '../../src/server/cards/promo/ArcadianCommunities';
import {testGame} from '../TestGame';
import {AresHandler} from '../../src/server/ares/AresHandler';
import {toID} from '../../src/common/utils/utils';
import {IGame} from '../../src/server/IGame';
import {Space} from '../../src/server/boards/Space';
import {SpaceBonus} from '../../src/common/boards/SpaceBonus';
import {maxOutOceans, setRulingParty, setTemperature} from '../TestingUtils';
import {PartyName} from '../../src/common/turmoil/PartyName';
import * as constants from '../../src/common/constants';

describe('MarsBoard', () => {
  let board: MarsBoard;
  let player: TestPlayer;
  let player2: TestPlayer;

  beforeEach(() => {
    board = TharsisBoard.newInstance(DEFAULT_GAME_OPTIONS, new SeededRandom(0));
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();

    // Rather than create a whole game around this test, I'm mocking data to make the tests pass.
    const gameOptions: Partial<GameOptions> = {pathfindersExpansion: false};
    (player as any).game = {gameOptions};
    (player2 as any).game = {gameOptions};
  });

  it('Can have greenery placed on any available land when player has no tile placed', () => {
    const availableSpaces = board.getAvailableSpacesForGreenery(player);
    expect(availableSpaces).has.lengthOf(board.getAvailableSpacesOnLand(player).length);
  });

  it('Can have greenery placed on any available land when player has a tile placed that is land locked', () => {
    board.spaces[2].player = player;
    board.spaces[2].tile = {tileType: TileType.GREENERY};
    board.spaces[7].player = player2;
    board.spaces[7].tile = {tileType: TileType.GREENERY};
    board.spaces[8].player = player2;
    board.spaces[8].tile = {tileType: TileType.GREENERY};
    const availableSpaces = board.getAvailableSpacesForGreenery(player);
    expect(availableSpaces).has.lengthOf(board.getAvailableSpacesOnLand(player).length);
  });

  it('Can only place greenery adjacent to a tile a player owns', () => {
    board.spaces[2].player = player;
    board.spaces[2].tile = {tileType: TileType.GREENERY};
    board.spaces[7].player = player2;
    board.spaces[7].tile = {tileType: TileType.GREENERY};
    const availableSpaces = board.getAvailableSpacesForGreenery(player);
    expect(availableSpaces).has.lengthOf(1);
  });

  // function expectSpace(space: Space, id: string, x: number, y: number) {
  //   if (id !== space.id || x !== space.x || y !== space.y) {
  //     expect.fail(`space ${space.id} at (${space.x}, ${space.y}) does not match [${id}, ${x}, ${y}]`);
  //   }
  // }


  it('getOceanSpaces', () => {
    expect(board.getOceanSpaces()).is.empty;

    const space1 = board.spaces[1];
    space1.spaceType = SpaceType.OCEAN;
    space1.tile = {tileType: TileType.OCEAN};

    expect(board.getOceanSpaces()).has.length(1);
    expect(board.getOceanSpaces({upgradedOceans: false})).has.length(1);
    expect(board.getOceanSpaces({upgradedOceans: true})).has.length(1);

    const space2 = board.spaces[2];
    space2.spaceType = SpaceType.OCEAN;
    space2.tile = {tileType: TileType.OCEAN_SANCTUARY};

    expect(board.getOceanSpaces()).has.length(2);
    expect(board.getOceanSpaces({upgradedOceans: false})).has.length(1);
    expect(board.getOceanSpaces({upgradedOceans: true})).has.length(2);

    const space3 = board.spaces[3];
    space3.spaceType = SpaceType.OCEAN;
    space3.tile = {tileType: TileType.WETLANDS};

    expect(board.getOceanSpaces()).has.length(2);
    expect(board.getOceanSpaces({upgradedOceans: false})).has.length(1);
    expect(board.getOceanSpaces({upgradedOceans: true})).has.length(2);
    expect(board.getOceanSpaces({wetlands: true})).has.length(3);
    expect(board.getOceanSpaces({wetlands: false})).has.length(2);
  });

  it('edges', () => {
    expect(board.getEdges().map(toID)).to.have.members(
      [
        '03', '04', '05', '06', '07',
        '08', '13',
        '14', '20',
        '21', '28',
        '29', '37',
        '38', '45',
        '46', '52',
        '53', '58',
        '59', '60', '61', '62', '63',
      ]);
  });

  it('Do not include land claimed hazard spaces for Arcadian Communities', () => {
    const card = new ArcadianCommunities();
    const [/* game */, player] = testGame(2, {aresExtension: true, aresHazards: true});
    player.playedCards.push(card);
    const board = player.game.board;
    const space = board.spaces.find(AresHandler.hasHazardTile);
    space!.player = player;
    expect(board.getAvailableSpacesForGreenery(player)).has.length(45);
  });

  describe('canAffordPlacementBonuses', () => {
    let game: IGame;
    let space: Space;

    beforeEach(() => {
      [game, player] = testGame(1);
      space = game.board.getSpaceOrThrow('15');
      space.bonus = [];
    });

    it('No bonuses is always affordable', () => {
      player.megaCredits = 0;
      expect(MarsBoard.canAffordPlacementBonuses(player, space)).is.true;
    });

    it('Ignores bonuses not subject to a cost', () => {
      space.bonus = [SpaceBonus.PLANT, SpaceBonus.STEEL, SpaceBonus.DRAW_CARD, SpaceBonus.HEAT];
      player.megaCredits = 0;
      expect(MarsBoard.canAffordPlacementBonuses(player, space)).is.true;
    });

    it('OCEAN bonus requires Hellas ocean cost', () => {
      space.bonus = [SpaceBonus.OCEAN];
      player.megaCredits = constants.HELLAS_BONUS_OCEAN_COST - 1;
      expect(MarsBoard.canAffordPlacementBonuses(player, space)).is.false;
      player.megaCredits = constants.HELLAS_BONUS_OCEAN_COST;
      expect(MarsBoard.canAffordPlacementBonuses(player, space)).is.true;
    });

    it('OCEAN bonus is free when oceans are maxed out', () => {
      space.bonus = [SpaceBonus.OCEAN];
      maxOutOceans(player);
      player.megaCredits = 0;
      expect(MarsBoard.canAffordPlacementBonuses(player, space)).is.true;
    });

    it('TEMPERATURE bonus requires Vastitas Borealis temperature cost', () => {
      space.bonus = [SpaceBonus.TEMPERATURE];
      player.megaCredits = constants.VASTITAS_BOREALIS_BONUS_TEMPERATURE_COST - 1;
      expect(MarsBoard.canAffordPlacementBonuses(player, space)).is.false;
      player.megaCredits = constants.VASTITAS_BOREALIS_BONUS_TEMPERATURE_COST;
      expect(MarsBoard.canAffordPlacementBonuses(player, space)).is.true;
    });

    it('TEMPERATURE bonus is free when temperature is maxed out', () => {
      space.bonus = [SpaceBonus.TEMPERATURE];
      setTemperature(game, constants.MAX_TEMPERATURE);
      player.megaCredits = 0;
      expect(MarsBoard.canAffordPlacementBonuses(player, space)).is.true;
    });

    it('TEMPERATURE_4MC bonus requires Vastitas Borealis Nova temperature cost', () => {
      space.bonus = [SpaceBonus.TEMPERATURE_4MC];
      player.megaCredits = constants.VASTITAS_BOREALIS_NOVA_BONUS_TEMPERATURE_COST - 1;
      expect(MarsBoard.canAffordPlacementBonuses(player, space)).is.false;
      player.megaCredits = constants.VASTITAS_BOREALIS_NOVA_BONUS_TEMPERATURE_COST;
      expect(MarsBoard.canAffordPlacementBonuses(player, space)).is.true;
    });

    it('COLONY bonus requires Terra Cimmeria colony cost', () => {
      space.bonus = [SpaceBonus.COLONY];
      player.megaCredits = constants.TERRA_CIMMERIA_COLONY_COST - 1;
      expect(MarsBoard.canAffordPlacementBonuses(player, space)).is.false;
      player.megaCredits = constants.TERRA_CIMMERIA_COLONY_COST;
      expect(MarsBoard.canAffordPlacementBonuses(player, space)).is.true;
    });

    it('Sums multiple unaffordable bonuses', () => {
      space.bonus = [SpaceBonus.OCEAN, SpaceBonus.TEMPERATURE];
      // Each bonus is checked independently, so M€ shortage on either fails.
      player.megaCredits = constants.HELLAS_BONUS_OCEAN_COST - 1;
      expect(MarsBoard.canAffordPlacementBonuses(player, space)).is.false;
      player.megaCredits = constants.VASTITAS_BOREALIS_BONUS_TEMPERATURE_COST - 1;
      expect(MarsBoard.canAffordPlacementBonuses(player, space)).is.false;
    });

    it('Reds tax adds to OCEAN cost', () => {
      [game, player] = testGame(1, {turmoilExtension: true});
      setRulingParty(game, PartyName.REDS);
      space = game.board.getSpaceOrThrow('15');
      space.bonus = [SpaceBonus.OCEAN];

      const redsCost = constants.HELLAS_BONUS_OCEAN_COST + constants.REDS_RULING_POLICY_COST;
      player.megaCredits = redsCost - 1;
      expect(MarsBoard.canAffordPlacementBonuses(player, space)).is.false;
      player.megaCredits = redsCost;
      expect(MarsBoard.canAffordPlacementBonuses(player, space)).is.true;
    });

    it('Reds tax not applied when global parameter is maxed', () => {
      [game, player] = testGame(1, {turmoilExtension: true});
      setRulingParty(game, PartyName.REDS);
      space = game.board.getSpaceOrThrow('15');
      space.bonus = [SpaceBonus.TEMPERATURE];
      setTemperature(game, constants.MAX_TEMPERATURE);

      player.megaCredits = 0;
      expect(MarsBoard.canAffordPlacementBonuses(player, space)).is.true;
    });
  });
});
