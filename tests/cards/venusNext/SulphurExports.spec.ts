import {expect} from 'chai';
import {SulphurExports} from '../../../src/server/cards/venusNext/SulphurExports';
import {Game} from '../../../src/server/Game';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('SulphurExports', function() {
  it('Should play', function() {
    const card = new SulphurExports();
    const player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, redPlayer], player);

    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
    expect(game.getVenusScaleLevel()).to.eq(2);
  });
});
