import {expect} from 'chai';
import {AtalantaPlanitiaLab} from '../../../src/server/cards/venusNext/AtalantaPlanitiaLab';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';

describe('AtalantaPlanitiaLab', function() {
  it('Should play', function() {
    const card = new AtalantaPlanitiaLab();
    const [/* game */, player] = testGame(2);
    expect(player.simpleCanPlay(card)).is.not.true;
    cast(card.play(player), undefined);
    expect(player.cardsInHand).has.lengthOf(2);
    expect(card.getVictoryPoints(player)).to.eq(2);
  });
});
