import {expect} from 'chai';
import {LagrangeObservatory} from '../../../src/server/cards/base/LagrangeObservatory';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('LagrangeObservatory', () => {
  it('Should play', () => {
    const card = new LagrangeObservatory();
    const [/* game */, player] = testGame(2);
    cast(card.play(player), undefined);

    expect(player.cardsInHand).has.lengthOf(1);
    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});
