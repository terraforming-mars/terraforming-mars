import {expect} from 'chai';
import {cast, runAllActions} from '../../TestingUtils';
import {BusinessNetwork} from '../../../src/server/cards/base/BusinessNetwork';
import {PowerPlant} from '../../../src/server/cards/base/PowerPlant';
import {TerralabsResearch} from '../../../src/server/cards/turmoil/TerralabsResearch';
import {SelectInitialCards} from '../../../src/server/inputs/SelectInitialCards';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {testGame} from '../../TestGame';

describe('TerralabsResearch', () => {
  it('Should play', () => {
    const card = new TerralabsResearch();
    const card2 = new PowerPlant();
    const card3 = new BusinessNetwork();
    const [game, player] = testGame(1, {skipInitialCardSelection: false});
    const pi = cast(player.getWaitingFor(), SelectInitialCards);
    pi.options[0].cb([card]);
    pi.options[1].cb([card2, card2]);
    pi.cb(undefined);

    // 14 starting MC - 1 for each card select at the start (total: 2)
    expect(player.megaCredits).to.eq(12);
    // 14 Solo TR - 1
    expect(player.getTerraformRating()).to.eq(13);

    player.playedCards.push(card3);
    expect(card3.action(player)).is.undefined;
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectCard);
    action.cb([action.cards[0]]);
    game.deferredActions.runNext();
    expect(player.megaCredits).to.eq(11);
    expect(player.cardsInHand).has.lengthOf(3);
  });
});
