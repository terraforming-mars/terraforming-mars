import {expect} from 'chai';
import {BusinessNetwork} from '../../../src/cards/base/BusinessNetwork';
import {PowerPlant} from '../../../src/cards/base/PowerPlant';
import {Polyphemos} from '../../../src/cards/colonies/Polyphemos';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {Game} from '../../../src/Game';
import {AndOptions} from '../../../src/inputs/AndOptions';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {Resources} from '../../../src/common/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('Polyphemos', function() {
  it('Should play', function() {
    const card = new Polyphemos();
    const card2 = new PowerPlant();
    const card3 = new BusinessNetwork();
    const player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player);
    const pi = player.getWaitingFor() as AndOptions;
    pi.options[0].cb([card]);
    pi.options[1].cb([card2, card2]);
    pi.cb();

    // 50 starting MC - 5 for each card select at the start (total: 10)
    expect(player.megaCredits).to.eq(40);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(5);

    player.playedCards.push(card3);
    const action = card3.action(player);
    expect(action).is.not.undefined;
    expect(action).instanceOf(SelectCard);
    (action as SelectCard<IProjectCard>).cb([(action as SelectCard<IProjectCard>).cards[0]]);
    player.game.deferredActions.runNext();
    expect(player.megaCredits).to.eq(35);
    expect(player.cardsInHand).has.lengthOf(3);
  });
});
