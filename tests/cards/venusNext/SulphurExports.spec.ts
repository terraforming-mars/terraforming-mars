import {expect} from 'chai';
import {SulphurExports} from '../../../src/cards/venusNext/SulphurExports';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestingUtils';

describe('SulphurExports', function() {
  it('Should play', function() {
    const card = new SulphurExports();
    const player = TestPlayers.BLUE.newPlayer();
    const game = new Game('foobar', [player, player], player);

    card.play(player, game);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
    expect(game.getVenusScaleLevel()).to.eq(2);
  });
});
