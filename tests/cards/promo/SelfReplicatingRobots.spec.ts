import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {Research} from '../../../src/cards/base/Research';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {HousePrinting} from '../../../src/cards/prelude/HousePrinting';
import {SelfReplicatingRobots} from '../../../src/cards/promo/SelfReplicatingRobots';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {Player} from '../../../src/Player';
import {TestPlayer} from '../../TestPlayer';

describe('SelfReplicatingRobots', function() {
  let card: SelfReplicatingRobots;
  let player: Player;

  beforeEach(function() {
    card = new SelfReplicatingRobots();
    player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player);
  });

  it('Can not play', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(new Research());
    expect(player.canPlayIgnoringCost(card)).is.true;
  });

  it('Should act', function() {
    player.playedCards.push(card);
    expect(card.canAct(player)).is.not.true;

    player.cardsInHand.push(new HousePrinting());
    expect(card.canAct(player)).is.true;

    const action = cast(card.action(player), OrOptions);
    action.options[0].cb([(action.options[0] as SelectCard<IProjectCard>).cards[0]]);
    expect(card.targetCards[0].resourceCount).to.eq(2);
    expect(player.cardsInHand).has.lengthOf(0);
    expect(card.targetCards).has.lengthOf(1);

    const action2 = cast(card.action(player), OrOptions);
    action2.options[0].cb([(action2.options[0] as SelectCard<IProjectCard>).cards[0]]);
    expect(card.targetCards[0].resourceCount).to.eq(4);
  });
});
