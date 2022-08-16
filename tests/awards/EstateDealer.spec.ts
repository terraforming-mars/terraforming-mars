import {expect} from 'chai';
import {Game} from '../../src/server/Game';
import {EstateDealer} from '../../src/server/awards/EstateDealer';
import {SpaceType} from '../../src/common/boards/SpaceType';
import {TileType} from '../../src/common/TileType';
import {TestPlayer} from '../TestPlayer';

describe('EstateDealer', function() {
  it('Correctly counts ocean tiles', function() {
    const award = new EstateDealer();
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, player2], player);

    game.addOceanTile(player2, '34'); // Normal ocean tile
    expect(award.getScore(player)).to.eq(0);

    // This tile should count
    game.addGreenery(player, '35');
    expect(award.getScore(player)).to.eq(1);

    game.addGreenery(player2, '28', SpaceType.OCEAN); // Greenery on ocean space
    expect(award.getScore(player)).to.eq(1);

    // This tile should not count
    game.addGreenery(player, '37');
    expect(award.getScore(player)).to.eq(1);
  });

  it('Correctly counts Ares upgraded oceans', function() {
    const award = new EstateDealer();
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, player2], player);

    game.addOceanTile(player2, '34');
    game.board.getSpace('34').tile!.tileType = TileType.OCEAN_CITY; // Upgraded ocean tile

    expect(award.getScore(player)).to.eq(0);

    // This tile should count
    game.addGreenery(player, '35');
    expect(award.getScore(player)).to.eq(1);

    game.addGreenery(player2, '28', SpaceType.OCEAN); // Greenery on ocean space
    expect(award.getScore(player)).to.eq(1);

    // This tile should not count
    game.addGreenery(player, '37');
    expect(award.getScore(player)).to.eq(1);
  });
});
