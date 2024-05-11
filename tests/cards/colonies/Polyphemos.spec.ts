import {expect} from 'chai';
import {cast, runAllActions} from '../../TestingUtils';
import {BusinessNetwork} from '../../../src/server/cards/base/BusinessNetwork';
import {PowerPlant} from '../../../src/server/cards/base/PowerPlant';
import {Polyphemos} from '../../../src/server/cards/colonies/Polyphemos';
import {SelectInitialCards} from '../../../src/server/inputs/SelectInitialCards';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {testGame} from '../../TestingUtils';

describe('Polyphemos', function() {
  it('Should play', function() {
    const card = new Polyphemos();
    const card2 = new PowerPlant();
    const card3 = new BusinessNetwork();
    const [/* game*/, player] = testGame(1, {skipInitialCardSelection: false});
    const pi = cast(player.getWaitingFor(), SelectInitialCards);
    pi.options[0].cb([card]);
    pi.options[1].cb([card2, card2]);
    pi.cb(undefined);

    // 50 starting MC - 5 for each card select at the start (total: 10)
    expect(player.megaCredits).to.eq(40);
    expect(player.production.megacredits).to.eq(5);

    player.playedCards.push(card3);
    expect(card3.action(player)).is.undefined;
    runAllActions(player.game);
    const action = cast(player.popWaitingFor(), SelectCard);
    action.cb([action.cards[0]]);
    runAllActions(player.game);
    expect(player.megaCredits).to.eq(35);
    expect(player.cardsInHand).has.lengthOf(3);
  });
});
