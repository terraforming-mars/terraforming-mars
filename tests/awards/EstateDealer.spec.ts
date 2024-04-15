import {expect} from 'chai';
import {Game} from '../../src/server/Game';
import {EstateDealer} from '../../src/server/awards/EstateDealer';
import {TileType} from '../../src/common/TileType';
import {TestPlayer} from '../TestPlayer';
import {addGreenery, addOcean} from '../TestingUtils';

describe('EstateDealer', function() {
  it('Correctly counts ocean tiles', function() {
    const award = new EstateDealer();
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, player2], player);

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

  it('Correctly counts Ares upgraded oceans', function() {
    const award = new EstateDealer();
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, player2], player);

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
