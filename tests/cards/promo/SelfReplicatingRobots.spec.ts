import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {Research} from '../../../src/server/cards/base/Research';
import {IProjectCard} from '../../../src/server/cards/IProjectCard';
import {HousePrinting} from '../../../src/server/cards/prelude/HousePrinting';
import {SelfReplicatingRobots} from '../../../src/server/cards/promo/SelfReplicatingRobots';
import {Game} from '../../../src/server/Game';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';
import {EarthOffice} from '../../../src/server/cards/base/EarthOffice';

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

    player.cardsInHand.push(new EarthOffice());
    expect(card.canAct(player)).is.not.true;

    player.cardsInHand.push(new HousePrinting());
    expect(card.canAct(player)).is.true;
  });

  it('act', () => {
    const earthOffice = new EarthOffice();
    player.cardsInHand.push(earthOffice);
    player.cardsInHand.push(new HousePrinting());

    const action = cast(card.action(player), OrOptions);
    action.options[0].cb([cast(action.options[0], SelectCard<IProjectCard>).cards[0]]);
    expect(card.targetCards[0].resourceCount).to.eq(2);
    expect(player.cardsInHand).deep.eq([earthOffice]);
    expect(card.targetCards).has.lengthOf(1);

    const action2 = cast(card.action(player), OrOptions);
    action2.options[0].cb([cast(action2.options[0], SelectCard<IProjectCard>).cards[0]]);
    expect(card.targetCards[0].resourceCount).to.eq(4);
  });
});
