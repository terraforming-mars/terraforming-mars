import {expect} from 'chai';
import {BusinessNetwork} from '../../../src/cards/base/BusinessNetwork';
import {PowerPlant} from '../../../src/cards/base/PowerPlant';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {TerralabsResearch} from '../../../src/cards/turmoil/TerralabsResearch';
import {Game} from '../../../src/Game';
import {AndOptions} from '../../../src/inputs/AndOptions';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {TestPlayers} from '../../TestPlayers';

describe('TerralabsResearch', function() {
  it('Should play', function() {
    const card = new TerralabsResearch();
    const card2 = new PowerPlant();
    const card3 = new BusinessNetwork();
    const player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('foobar', [player], player);
    const pi = player.getWaitingFor() as AndOptions;
    pi.options[0].cb([card]);
    pi.options[1].cb([card2, card2]);
    pi.cb();

    // 14 starting MC - 1 for each card select at the start (total: 2)
    expect(player.megaCredits).to.eq(12);
    // 14 Solo TR - 1
    expect(player.getTerraformRating()).to.eq(13);

    player.playedCards.push(card3);
    const action = card3.action(player);
    expect(action).is.not.undefined;
    expect(action).instanceOf(SelectCard);
    (action as SelectCard<IProjectCard>).cb([(action as SelectCard<IProjectCard>).cards[0]]);
    game.deferredActions.runNext();
    expect(player.megaCredits).to.eq(11);
    expect(player.cardsInHand).has.lengthOf(3);
  });
});
