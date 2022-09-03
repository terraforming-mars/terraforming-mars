import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {BusinessNetwork} from '../../../src/server/cards/base/BusinessNetwork';
import {PowerPlant} from '../../../src/server/cards/base/PowerPlant';
import {TerralabsResearch} from '../../../src/server/cards/turmoil/TerralabsResearch';
import {Game} from '../../../src/server/Game';
import {SelectInitialCards} from '../../../src/server/inputs/SelectInitialCards';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {TestPlayer} from '../../TestPlayer';

describe('TerralabsResearch', function() {
  it('Should play', function() {
    const card = new TerralabsResearch();
    const card2 = new PowerPlant();
    const card3 = new BusinessNetwork();
    const player = TestPlayer.BLUE.newPlayer();
    const game = Game.newInstance('gameid', [player], player);
    const pi = cast(player.getWaitingFor(), SelectInitialCards);
    pi.options[0].cb([card]);
    pi.options[1].cb([card2, card2]);
    pi.cb();

    // 14 starting MC - 1 for each card select at the start (total: 2)
    expect(player.megaCredits).to.eq(12);
    // 14 Solo TR - 1
    expect(player.getTerraformRating()).to.eq(13);

    player.playedCards.push(card3);
    const action = cast(card3.action(player), SelectCard);
    action.cb([action.cards[0]]);
    game.deferredActions.runNext();
    expect(player.megaCredits).to.eq(11);
    expect(player.cardsInHand).has.lengthOf(3);
  });
});
