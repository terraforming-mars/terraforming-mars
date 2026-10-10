import {expect} from 'chai';
import {testGame} from '../TestGame';
import {Physicist} from '@/server/awards/Physicist';
import {fakeCard} from '../TestingUtils';
import {Tag} from '@/common/cards/Tag';
import {TestPlayer} from '../TestPlayer';

describe('Physicist', () => {
  let award: Physicist;
  let player: TestPlayer;

  beforeEach(() => {
    award = new Physicist();
    [/* game */, player] = testGame(2);
  });

  it('counts science and space tags combined', () => {
    expect(award.getScore(player)).to.eq(0);

    player.playedCards.push(fakeCard({tags: [Tag.SCIENCE]}));
    expect(award.getScore(player)).to.eq(1);

    player.playedCards.push(fakeCard({tags: [Tag.SPACE, Tag.SPACE]}));
    expect(award.getScore(player)).to.eq(3);

    // A card carrying both tags contributes to both counts.
    player.playedCards.push(fakeCard({tags: [Tag.SCIENCE, Tag.SPACE]}));
    expect(award.getScore(player)).to.eq(5);
  });

  it('does not count wild tags', () => {
    player.playedCards.push(fakeCard({tags: [Tag.SCIENCE]}));
    player.playedCards.push(fakeCard({tags: [Tag.WILD]}));
    expect(award.getScore(player)).to.eq(1);
  });
});
