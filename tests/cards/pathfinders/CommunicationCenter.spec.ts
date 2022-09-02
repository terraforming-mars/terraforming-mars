import {expect} from 'chai';
import {CommunicationCenter} from '../../../src/server/cards/pathfinders/CommunicationCenter';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {fakeCard, runAllActions} from '../../TestingUtils';
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
    expect(card.canPlay(player)).is.false;

    player.production.add(Resources.ENERGY, 1);

    expect(card.canPlay(player)).is.true;
  });

  it('play', () => {
    card.resourceCount = 0;
    player.production.add(Resources.ENERGY, 2);

    expect(card.play(player));

    runAllActions(game);

    expect(card.resourceCount).eq(2);
    expect(player.production.energy).eq(1);
  });

  it('onCardPlayed', () => {
    player.playedCards = [card];
    expect(card.resourceCount).eq(0);

    player.onCardPlayed(fakeCard({cardType: CardType.ACTIVE}));
    expect(card.resourceCount).eq(0);
    player.onCardPlayed(fakeCard({cardType: CardType.AUTOMATED}));
    expect(card.resourceCount).eq(0);
    player.onCardPlayed(fakeCard({cardType: CardType.CORPORATION}));
    expect(card.resourceCount).eq(0);
    player.onCardPlayed(fakeCard({cardType: CardType.PRELUDE}));
    expect(card.resourceCount).eq(0);

    player.onCardPlayed(fakeCard({cardType: CardType.EVENT}));
    expect(card.resourceCount).eq(1);

    otherPlayer.onCardPlayed(fakeCard({cardType: CardType.EVENT}));
    expect(card.resourceCount).eq(2);

    expect(player.cardsInHand).is.length(0);
    expect(otherPlayer.cardsInHand).is.length(0);

    otherPlayer.onCardPlayed(fakeCard({cardType: CardType.EVENT}));

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
