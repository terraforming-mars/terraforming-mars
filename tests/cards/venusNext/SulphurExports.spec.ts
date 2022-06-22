import {expect} from 'chai';
import {SulphurExports} from '../../../src/cards/venusNext/SulphurExports';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/common/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('SulphurExports', function() {
  it('Should play', function() {
    const card = new SulphurExports();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, redPlayer], player);

    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
    expect(game.getVenusScaleLevel()).to.eq(2);
  });
});
