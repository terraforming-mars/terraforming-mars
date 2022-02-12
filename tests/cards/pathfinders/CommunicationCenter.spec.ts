import {expect} from 'chai';
import {CommunicationCenter} from '../../../src/cards/pathfinders/CommunicationCenter';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {TestingUtils} from '../../TestingUtils';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {Resources} from '../../../src/common/Resources';
import {CardType} from '../../../src/common/cards/CardType';

describe('CommunicationCenter', function() {
  let card: CommunicationCenter;
  let player: TestPlayer;
  let otherPlayer: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new CommunicationCenter();
    game = newTestGame(2, {pathfindersExpansion: true});
    player = getTestPlayer(game, 0);
    otherPlayer = getTestPlayer(game, 1);
    player.playedCards = [card];
  });

  it('canPlay', () => {
    expect(player.canPlayIgnoringCost(card)).is.false;

    player.addProduction(Resources.ENERGY, 1);

    expect(player.canPlayIgnoringCost(card)).is.true;
  });

  it('play', () => {
    card.resourceCount = 0;
    player.addProduction(Resources.ENERGY, 2);

    expect(card.play(player));

    TestingUtils.runAllActions(game);

    expect(card.resourceCount).eq(2);
    expect(player.getProduction(Resources.ENERGY)).eq(1);
  });

  it('onCardPlayed', () => {
    player.playedCards = [card];
    expect(card.resourceCount).eq(0);

    player.onCardPlayed(TestingUtils.fakeCard({cardType: CardType.ACTIVE}));
    expect(card.resourceCount).eq(0);
    player.onCardPlayed(TestingUtils.fakeCard({cardType: CardType.AUTOMATED}));
    expect(card.resourceCount).eq(0);
    player.onCardPlayed(TestingUtils.fakeCard({cardType: CardType.CORPORATION}));
    expect(card.resourceCount).eq(0);
    player.onCardPlayed(TestingUtils.fakeCard({cardType: CardType.PRELUDE}));
    expect(card.resourceCount).eq(0);

    player.onCardPlayed(TestingUtils.fakeCard({cardType: CardType.EVENT}));
    expect(card.resourceCount).eq(1);

    otherPlayer.onCardPlayed(TestingUtils.fakeCard({cardType: CardType.EVENT}));
    expect(card.resourceCount).eq(2);

    expect(player.cardsInHand).is.length(0);
    expect(otherPlayer.cardsInHand).is.length(0);

    otherPlayer.onCardPlayed(TestingUtils.fakeCard({cardType: CardType.EVENT}));

    expect(card.resourceCount).eq(0);
    expect(player.cardsInHand).is.length(1);
    expect(otherPlayer.cardsInHand).is.length(0);
  });

  it('card.addResourceTo', () => {
    player.playedCards = [card];
    card.resourceCount = 2;
    expect(player.cardsInHand).is.length(0);
    player.addResourceTo(card, 8);
    expect(card.resourceCount).eq(1);
    expect(player.cardsInHand).is.length(3);
  });
});
