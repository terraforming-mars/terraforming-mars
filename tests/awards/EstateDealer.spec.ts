import {expect} from 'chai';
import {testGame} from '../TestGame';
import {EstateDealer} from '../../src/server/awards/EstateDealer';
import {TileType} from '../../src/common/TileType';
import {addGreenery, addOcean} from '../TestingUtils';

describe('EstateDealer', () => {
  it('Correctly counts ocean tiles', () => {
    const award = new EstateDealer();
    const [/* game */, player, player2] = testGame(2);

    addOcean(player2, '34'); // Normal ocean tile
    expect(award.getScore(player)).to.eq(0);

    // This tile should count
    addGreenery(player, '35');
    expect(award.getScore(player)).to.eq(1);

    addGreenery(player2, '28'); // Greenery on ocean space
    expect(award.getScore(player)).to.eq(1);

    // This tile should not count
    addGreenery(player, '37');
    expect(award.getScore(player)).to.eq(1);
  });

  it('Correctly counts Ares upgraded oceans', () => {
    const award = new EstateDealer();
    const [game, player, player2] = testGame(2);

    addOcean(player2, '34');
    game.board.getSpaceOrThrow('34').tile!.tileType = TileType.OCEAN_CITY; // Upgraded ocean tile

    expect(award.getScore(player)).to.eq(0);

    // This tile should count
    addGreenery(player, '35');
    expect(award.getScore(player)).to.eq(1);

    addGreenery(player2, '28'); // Greenery on ocean space
    expect(award.getScore(player)).to.eq(1);

    // This tile should not count
    addGreenery(player, '37');
    expect(award.getScore(player)).to.eq(1);
  });
});
