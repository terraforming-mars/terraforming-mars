import {expect} from 'chai';
import {LagrangeObservatory} from '../../../src/server/cards/base/LagrangeObservatory';
import {testGame} from '../../TestGame';

describe('LagrangeObservatory', function() {
  it('Should play', function() {
    const card = new LagrangeObservatory();
    const [, player] = testGame(2);
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.cardsInHand).has.lengthOf(1);
    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});
