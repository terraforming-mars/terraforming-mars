import {expect} from 'chai';
import {Geologist} from '../../../src/server/milestones/modular/Geologist';
import {TileType} from '../../../src/common/TileType';
import {testGame} from '../../TestingUtils';

describe('Geologist Milestone', () => {
  let milestone: Geologist;

  beforeEach(() => {
    milestone = new Geologist();
  });

  it('Achieves milestone by placing 3 tiles on or adjacent to volcanic spaces', () => {
    const [game, player] = testGame(2);
    const board = game.board;

    // Space 22 is not a volcanic space, but is next to two volcanic spaces.
    // Confirming just to show the reader.
    const space = board.getSpaceOrThrow('22');
    expect(space.volcanic).is.not.true;
    const adjacentSpaces = board.getAdjacentSpaces(space);
    const adjacentVolcanicSpaces = adjacentSpaces.filter((adj) => adj.volcanic);
    expect(adjacentVolcanicSpaces).has.length(2);

    game.simpleAddTile(player, space, {tileType: TileType.GREENERY}); // This is adjacent to 2 volcanic areas if I checked correctly
    expect(milestone.getScore(player)).to.eq(1);

    game.simpleAddTile(player, adjacentVolcanicSpaces[0], {tileType: TileType.CITY});
    game.simpleAddTile(player, adjacentVolcanicSpaces[1], {tileType: TileType.GREENERY});
    expect(milestone.getScore(player)).to.eq(3);
  });

  it('Does not count hazard tiles', () => {
    const [game, player] = testGame(2);
    const board = game.board;
    const volcanicSpaces = board.volcanicSpaceIds.map((id) => board.getSpaceOrThrow(id));

    // Place a hazard tile on a volcanic space
    game.simpleAddTile(player, volcanicSpaces[0], {tileType: TileType.DUST_STORM_MILD});
    expect(milestone.getScore(player)).to.eq(0);
    volcanicSpaces[0].tile!.tileType = TileType.GREENERY; // Convert to greenery, should now count
    expect(milestone.getScore(player)).to.eq(1);
  });
});
