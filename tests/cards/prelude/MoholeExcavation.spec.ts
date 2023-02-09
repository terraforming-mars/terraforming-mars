import {expect} from 'chai';
import {MoholeExcavation} from '../../../src/server/cards/prelude/MoholeExcavation';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('MoholeExcavation', function() {
  it('Should play', function() {
    const card = new MoholeExcavation();
    const game = newTestGame(1);
    const player = getTestPlayer(game, 0);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.heat).to.eq(2);
    expect(player.heat).to.eq(2);
    expect(player.production.steel).to.eq(1);
  });
});
