import {expect} from 'chai';
import {MoholeExcavation} from '../../../src/server/cards/prelude/MoholeExcavation';
import {testGame} from '../../TestGame';

describe('MoholeExcavation', function() {
  it('Should play', function() {
    const card = new MoholeExcavation();
    const [, player] = testGame(1);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.heat).to.eq(2);
    expect(player.heat).to.eq(2);
    expect(player.production.steel).to.eq(1);
  });
});
