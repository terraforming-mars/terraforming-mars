import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {fakeCard} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {MoonTether} from '../../../src/server/cards/moon/MoonTether';
import {Tag} from '../../../src/common/cards/Tag';

describe('MoonTether', () => {
  let player: TestPlayer;
  let card: MoonTether;

  beforeEach(() => {
    [/* game */, player] = testGame(1, {moonExpansion: true});
    card = new MoonTether();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    expect(player.getPlayableCardsForTest()).does.not.include(card);

    player.playedCards.push(fakeCard({tags: [Tag.SPACE, Tag.SPACE, Tag.SPACE, Tag.SPACE, Tag.SPACE]}));
    expect(player.getPlayableCardsForTest()).does.not.include(card);

    // Pushing a sixth tag will do it.
    player.playedCards.push(fakeCard({tags: [Tag.SPACE]}));
    expect(player.getPlayableCardsForTest()).includes(card);
  });

  it('play', () => {
    card.play(player);

    expect(card.getVictoryPoints(player)).to.eq(1);
    expect(card.getCardDiscount()).to.eq(2);
  });
});

