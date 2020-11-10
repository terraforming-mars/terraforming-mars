import {expect} from 'chai';
import {GHGImportFromVenus} from '../../../src/cards/venusNext/GHGImportFromVenus';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';

describe('GHGImportFromVenus', function() {
  it('Should play', function() {
    const card = new GHGImportFromVenus();
    const player = new Player('test', Color.BLUE, false);
    const game = new Game('foobar', [player, player], player);

    const action = card.play(player, game);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.HEAT)).to.eq(3);
    expect(game.getVenusScaleLevel()).to.eq(2);
  });
});
