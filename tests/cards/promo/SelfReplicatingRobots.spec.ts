import {expect} from 'chai';
import {Research} from '../../../src/cards/base/Research';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {HousePrinting} from '../../../src/cards/prelude/HousePrinting';
import {SelfReplicatingRobots} from '../../../src/cards/promo/SelfReplicatingRobots';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestingUtils';

describe('SelfReplicatingRobots', function() {
  let card : SelfReplicatingRobots; let player : Player; let game : Game;

  beforeEach(function() {
    card = new SelfReplicatingRobots();
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('foobar', [player], player);
  });

  it('Can\'t play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(new Research());
    expect(card.canPlay(player)).is.true;
  });

  it('Should act', function() {
    player.playedCards.push(card);
    expect(card.canAct(player)).is.not.true;

    player.cardsInHand.push(new HousePrinting());
    expect(card.canAct(player)).is.true;

    const action = card.action(player, game);
    expect(action instanceof OrOptions).is.true;
    (action as OrOptions).options[0].cb([(action.options[0] as SelectCard<IProjectCard>).cards[0]]);
    expect(card.targetCards[0].resourceCount).to.eq(2);
    expect(player.cardsInHand).has.lengthOf(0);
    expect(card.targetCards).has.lengthOf(1);

    const action2 = card.action(player, game);
    expect(action2 instanceof OrOptions).is.true;
    (action2 as OrOptions).options[0].cb([(action2.options[0] as SelectCard<IProjectCard>).cards[0]]);
    expect(card.targetCards[0].resourceCount).to.eq(4);
  });
});
