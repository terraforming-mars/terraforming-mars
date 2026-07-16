import {expect} from 'chai';
import {MoholeExcavation} from '../../../src/server/cards/prelude/MoholeExcavation';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('MoholeExcavation', () => {
  it('Should play', () => {
    const card = new MoholeExcavation();
    const [/* game */, player] = testGame(1);
    cast(card.play(player), undefined);
    expect(player.production.heat).to.eq(2);
    expect(player.heat).to.eq(2);
    expect(player.production.steel).to.eq(1);
  });
});
