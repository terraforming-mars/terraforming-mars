import {expect} from 'chai';
import {AtalantaPlanitiaLab} from '../../../src/server/cards/venusNext/AtalantaPlanitiaLab';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('AtalantaPlanitiaLab', () => {
  it('Should play', () => {
    const card = new AtalantaPlanitiaLab();
    const [/* game */, player] = testGame(2);
    expect(card.canPlay(player)).is.not.true;
    cast(card.play(player), undefined);
    expect(player.cardsInHand).has.lengthOf(2);
    expect(card.getVictoryPoints(player)).to.eq(2);
  });
});
