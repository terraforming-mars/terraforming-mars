import {expect} from 'chai';
import {Research} from '../../../src/server/cards/base/Research';
import {testGame} from '../../TestGame';

describe('Research', function() {
  it('Should play', function() {
    const card = new Research();
    const [, player] = testGame(2);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(card.getVictoryPoints(player)).to.eq(1);
    expect(player.cardsInHand).has.lengthOf(2);
    expect(player.cardsInHand[0]).not.to.eq(player.cardsInHand[1]);
  });
});
