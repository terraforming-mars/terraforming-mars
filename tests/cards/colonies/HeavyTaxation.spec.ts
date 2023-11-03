import {expect} from 'chai';
import {HeavyTaxation} from '../../../src/server/cards/colonies/HeavyTaxation';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('HeavyTaxation', function() {
  it('Should play', function() {
    const card = new HeavyTaxation();
    const [/* game */, player] = testGame(1);
    expect(player.simpleCanPlay(card)).is.not.true;
    cast(card.play(player), undefined);
    expect(player.production.megacredits).to.eq(2);
    expect(player.megaCredits).to.eq(4);
  });
});
