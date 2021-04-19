import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {LunarObservationPost} from '../../../src/cards/moon/LunarObservationPost';
import {expect} from 'chai';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('LunarObservationPost', () => {
  let game: Game;
  let player: Player;
  let card: LunarObservationPost;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('id', [player], player, MOON_OPTIONS);
    card = new LunarObservationPost();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    player.titanium = 1;
    expect(player.getPlayableCards()).does.include(card);

    player.titanium = 0;
    expect(player.getPlayableCards()).does.not.include(card);
  });

  it('play', () => {
    player.titanium = 3;

    card.play(player);

    expect(player.titanium).eq(2);
  });

  it('act', () => {
    player.playedCards.push(card);

    expect(card.resourceCount).eq(0);

    card.action(player);
    const action = game.deferredActions.pop();
    action!.execute();

    expect(card.resourceCount).eq(1);

    // This could also test that it offers a choice of cards, but I'm leaving
    // that up to the underlying AddResourcesToCard.
  });

  it('getVictoryPoints', () => {
    card.resourceCount = 0;
    expect(card.getVictoryPoints()).eq(0);
    card.resourceCount = 1;
    expect(card.getVictoryPoints()).eq(0);
    card.resourceCount = 2;
    expect(card.getVictoryPoints()).eq(0);

    card.resourceCount = 3;
    expect(card.getVictoryPoints()).eq(1);
    card.resourceCount = 4;
    expect(card.getVictoryPoints()).eq(1);
    card.resourceCount = 5;
    expect(card.getVictoryPoints()).eq(1);

    card.resourceCount = 6;
    expect(card.getVictoryPoints()).eq(2);
    card.resourceCount = 7;
    expect(card.getVictoryPoints()).eq(2);
    card.resourceCount = 8;
    expect(card.getVictoryPoints()).eq(2);
  });
});
