import {expect} from 'chai';
import {churnAction} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {LunarObservationPost} from '../../../src/server/cards/moon/LunarObservationPost';
import {testGame} from '../../TestGame';

describe('LunarObservationPost', () => {
  let player: TestPlayer;
  let card: LunarObservationPost;

  beforeEach(() => {
    [/* game */, player] = testGame(2, {moonExpansion: true});
    card = new LunarObservationPost();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    player.titanium = 1;
    expect(player.getPlayableCardsForTest()).does.include(card);

    player.titanium = 0;
    expect(player.getPlayableCardsForTest()).does.not.include(card);
  });

  it('play', () => {
    player.titanium = 3;

    card.play(player);

    expect(player.titanium).eq(2);
  });

  it('act', () => {
    player.playedCards.push(card);

    expect(card.resourceCount).eq(0);

    expect(churnAction(card, player)).is.undefined;

    expect(card.resourceCount).eq(1);

    // This could also test that it offers a choice of cards, but I'm leaving
    // that up to the underlying AddResourcesToCard.
  });

  it('getVictoryPoints', () => {
    card.resourceCount = 0;
    expect(card.getVictoryPoints(player)).eq(0);
    card.resourceCount = 1;
    expect(card.getVictoryPoints(player)).eq(0);
    card.resourceCount = 2;
    expect(card.getVictoryPoints(player)).eq(0);

    card.resourceCount = 3;
    expect(card.getVictoryPoints(player)).eq(1);
    card.resourceCount = 4;
    expect(card.getVictoryPoints(player)).eq(1);
    card.resourceCount = 5;
    expect(card.getVictoryPoints(player)).eq(1);

    card.resourceCount = 6;
    expect(card.getVictoryPoints(player)).eq(2);
    card.resourceCount = 7;
    expect(card.getVictoryPoints(player)).eq(2);
    card.resourceCount = 8;
    expect(card.getVictoryPoints(player)).eq(2);
  });
});
