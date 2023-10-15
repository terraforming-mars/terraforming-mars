import {expect} from 'chai';
import {Research} from '../../../src/server/cards/base/Research';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('Research', function() {
  it('Should play', function() {
    const card = new Research();
    const [/* skipped */, player] = testGame(2);
    cast(card.play(player), undefined);
    expect(card.getVictoryPoints(player)).to.eq(1);
    expect(player.cardsInHand).has.lengthOf(2);
    expect(player.cardsInHand[0]).not.to.eq(player.cardsInHand[1]);
  });
});
