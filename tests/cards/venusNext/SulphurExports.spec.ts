import {expect} from 'chai';
import {SulphurExports} from '../../../src/server/cards/venusNext/SulphurExports';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('SulphurExports', function() {
  it('Should play', function() {
    const card = new SulphurExports();
    const game = newTestGame(2);
    const player = getTestPlayer(game, 0);

    card.play(player);
    expect(player.production.megacredits).to.eq(1);
    expect(game.getVenusScaleLevel()).to.eq(2);
  });
});
