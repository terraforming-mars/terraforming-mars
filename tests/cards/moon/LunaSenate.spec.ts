import {expect} from 'chai';
import {TestPlayer} from '../../TestPlayer';
import {LunaSenate} from '../../../src/server/cards/moon/LunaSenate';
import {testGame} from '../../TestingUtils';

describe('LunaSenate', () => {
  let player: TestPlayer;
  let player2: TestPlayer;
  let card: LunaSenate;

  beforeEach(() => {
    [/* game */, player, player2] = testGame(2, {moonExpansion: true});
    card = new LunaSenate();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    player.tagsForTest = {moon: 3};
    expect(player.getPlayableCardsForTest()).does.include(card);

    player.tagsForTest = {moon: 2};
    expect(player.getPlayableCardsForTest()).does.not.include(card);
  });

  it('play', () => {
    player.tagsForTest = {moon: 3};
    player2.tagsForTest = {moon: 4};
    player.production.override({megacredits: 0});

    card.play(player);

    expect(player.production.megacredits).eq(4);
  });

  it('does not count opponent wild tags', () => {
    player.tagsForTest = {moon: 3};
    player2.tagsForTest = {moon: 3, wild: 2};
    player.production.override({megacredits: 0});

    card.play(player);

    expect(player.production.megacredits).eq(3);
  });

  it('getVictoryPoints', () => {
    player.playedCards.push(card);
    player.tagsForTest = {moon: 3};
    player2.tagsForTest = {moon: 1};
    expect(card.getVictoryPoints(player)).eq(3);

    player.tagsForTest = {moon: 4};
    expect(card.getVictoryPoints(player)).eq(4);
  });
});

