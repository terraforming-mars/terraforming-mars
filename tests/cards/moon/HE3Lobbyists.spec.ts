import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {HE3Lobbyists} from '../../../src/server/cards/moon/HE3Lobbyists';

describe('HE3Lobbyists', () => {
  let player: TestPlayer;
  let card: HE3Lobbyists;

  beforeEach(() => {
    [/* game */, player] = testGame(1, {moonExpansion: true});
    card = new HE3Lobbyists();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    expect(player.getPlayableCardsForTest()).does.include(card);
  });

  it('play', () => {
    player.production.override({megacredits: 0});
    player.tagsForTest = {moon: 0};
    card.play(player);
    expect(player.production.megacredits).eq(1);


    player.production.override({megacredits: 0});
    player.tagsForTest = {moon: 7};
    card.play(player);
    expect(player.production.megacredits).eq(8);
  });
});

