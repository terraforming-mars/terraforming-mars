import {expect} from 'chai';
import {SulphurExports} from '../../../src/server/cards/venusNext/SulphurExports';
import {testGame} from '../../TestGame';

describe('SulphurExports', () => {
  it('Should play', () => {
    const card = new SulphurExports();
    const [game, player] = testGame(2);

    card.play(player);
    expect(player.production.megacredits).to.eq(1);
    expect(game.getVenusScaleLevel()).to.eq(2);
  });
});
