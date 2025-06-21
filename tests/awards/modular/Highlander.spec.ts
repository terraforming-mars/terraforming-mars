import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {Highlander} from '../../../src/server/awards/modular/Highlander';
import {TileType} from '../../../src/common/TileType';
import {addGreenery, addOcean} from '../../TestingUtils';

describe('Highlander', () => {
  it('Correctly counts tiles not adjacent to ocean tiles', () => {
    const award = new Highlander();
    const [/* game */, player, player2] = testGame(2);

    addOcean(player2, '34'); // Add an ocean tile
    expect(award.getScore(player)).to.eq(0);

    // This tile should not count (adjacent to ocean)
    addGreenery(player, '35');
    expect(award.getScore(player)).to.eq(0);

    // This tile should count (not adjacent to any ocean)
    addGreenery(player, '36');
    expect(award.getScore(player)).to.eq(1);

    // This tile should count (not adjacent to any ocean)
    addGreenery(player, '37');
    expect(award.getScore(player)).to.eq(2);

    // Greenery on ocean space, but not adjacent to ocean
    addGreenery(player2, '28');
    expect(award.getScore(player)).to.eq(2);
  });

  it('Correctly handles Ares upgraded oceans', () => {
    const award = new Highlander();
    const [game, player, player2] = testGame(2);

    addOcean(player2, '34');
    game.board.getSpaceOrThrow('34').tile!.tileType = TileType.OCEAN_CITY; // Upgraded ocean tile

    expect(award.getScore(player)).to.eq(0);

    // This tile should not count (adjacent to ocean city)
    addGreenery(player, '35');
    expect(award.getScore(player)).to.eq(0);

    // This tile should count (not adjacent to ocean)
    addGreenery(player, '36');
    expect(award.getScore(player)).to.eq(1);

    // Greenery on ocean space, but not adjacent to ocean
    addGreenery(player, '28');
    expect(award.getScore(player)).to.eq(2);
  });
});
