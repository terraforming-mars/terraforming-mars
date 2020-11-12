
import {expect} from 'chai';
import {Color} from '../../src/Color';
import {Player} from '../../src/Player';
import {Game} from '../../src/Game';
import {EstateDealer} from '../../src/awards/EstateDealer';
import {SpaceType} from '../../src/SpaceType';
import {TileType} from '../../src/TileType';

describe('EstateDealer', function() {
  it('Correctly counts ocean tiles', function() {
    const award = new EstateDealer();
    const player = new Player('test', Color.BLUE, false);
    const player2 = new Player('test2', Color.RED, false);
    const game = new Game('foobar', [player, player2], player);

    game.addOceanTile(player2, '34'); // Normal ocean tile
    expect(award.getScore(player, game)).to.eq(0);

    // This tile should count
    game.addGreenery(player, '35');
    expect(award.getScore(player, game)).to.eq(1);

    game.addGreenery(player2, '28', SpaceType.OCEAN); // Greenery on ocean space
    expect(award.getScore(player, game)).to.eq(1);

    // This tile should not count
    game.addGreenery(player, '37');
    expect(award.getScore(player, game)).to.eq(1);
  });

  it('Correctly counts Ares upgraded oceans', function() {
    const award = new EstateDealer();
    const player = new Player('test', Color.BLUE, false);
    const player2 = new Player('test2', Color.RED, false);
    const game = new Game('foobar', [player, player2], player);

    game.addOceanTile(player2, '34');
        game.getSpace('34').tile!.tileType = TileType.OCEAN_CITY; // Upgraded ocean tile

        expect(award.getScore(player, game)).to.eq(0);

        // This tile should count
        game.addGreenery(player, '35');
        expect(award.getScore(player, game)).to.eq(1);

        game.addGreenery(player2, '28', SpaceType.OCEAN); // Greenery on ocean space
        expect(award.getScore(player, game)).to.eq(1);

        // This tile should not count
        game.addGreenery(player, '37');
        expect(award.getScore(player, game)).to.eq(1);
  });
});
