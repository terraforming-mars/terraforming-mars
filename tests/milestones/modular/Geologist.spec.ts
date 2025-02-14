import {expect} from 'chai';
import {Geologist} from '../../../src/server/milestones/modular/Geologist';
import {TileType} from '../../../src/common/TileType';
import {SpaceName} from '../../../src/common/boards/SpaceName';
import {testGame} from '../../TestingUtils';

describe('Geologist Milestone', () => {
  let milestone: Geologist;

  beforeEach(() => {
    milestone = new Geologist();
  });

  it('Achieves milestone by placing 3 tiles on or adjacent to volcanic spaces', () => {
    const [game, player] = testGame(2);
    const board = game.board;
    const landSpaces = board.getAvailableSpacesOnLand(player);

    // Place three tiles on or adjacent to volcanic spaces
    game.simpleAddTile(player, landSpaces[3], {tileType: TileType.GREENERY}); // This is adjacent to 2 volcanic areas if I checked correctly
    expect(milestone.getScore(player)).to.eq(1);

    game.simpleAddTile(player, board.getSpaceOrThrow(SpaceName.ASCRAEUS_MONS), {tileType: TileType.CITY});
    game.simpleAddTile(player, board.getSpaceOrThrow(SpaceName.PAVONIS_MONS), {tileType: TileType.GREENERY});
    expect(milestone.getScore(player)).to.eq(3);
  });

  it('Does not count hazard tiles', () => {
    const [game, player] = testGame(2);
    const board = game.board;

    // Place a hazard tile on a volcanic space
    game.simpleAddTile(player, board.getSpaceOrThrow(SpaceName.THARSIS_THOLUS), {tileType: TileType.DUST_STORM_MILD});
    expect(milestone.getScore(player)).to.eq(0);

    // Place two non-hazard tiles adjacent to volcanic spaces
    const pavonisAdjacent = board.getAdjacentSpaces(board.getSpaceOrThrow(SpaceName.PAVONIS_MONS))[0];
    game.simpleAddTile(player, pavonisAdjacent, {tileType: TileType.GREENERY});
    game.simpleAddTile(player, board.getSpaceOrThrow(SpaceName.ARSIA_MONS), {tileType: TileType.CITY});

    expect(milestone.getScore(player)).to.eq(2); // Only non-hazard tiles should be counted
  });
});
