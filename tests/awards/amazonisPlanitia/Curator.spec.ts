import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {Curator} from '../../../src/server/awards/amazonisPlanitia/Curator';
import {fakeCard} from '../../TestingUtils';
import {Tag} from '../../../src/common/cards/Tag';
import {TestPlayer} from '../../TestPlayer';
import {CardType} from '../../../src/common/cards/CardType';
import {Chimera} from '../../../src/server/cards/pathfinders/Chimera';
import {Odyssey} from '../../../src/server/cards/pathfinders/Odyssey';

describe('Curator', () => {
  let award: Curator;
  let player: TestPlayer;

  beforeEach(() => {
    award = new Curator();
    [/* game */, player] = testGame(2);
  });

  it('Counts tags', () => {
    expect(award.getScore(player)).to.eq(0);

    player.playedCards.push(fakeCard({tags: [Tag.SPACE]}));
    expect(award.getScore(player)).to.eq(1);

    player.playedCards.push(fakeCard({tags: [Tag.SPACE]}));
    expect(award.getScore(player)).to.eq(2);
  });

  it('Does not count wild tags', () => {
    expect(award.getScore(player)).to.eq(0);

    player.playedCards.push(fakeCard({tags: [Tag.SPACE, Tag.BUILDING]}));
    expect(award.getScore(player)).to.eq(1);

    player.playedCards.push(fakeCard({tags: [Tag.WILD]}));
    expect(award.getScore(player)).to.eq(1);
  });

  it('Does not count events', () => {
    expect(award.getScore(player)).to.eq(0);

    player.playedCards.push(fakeCard({tags: [Tag.SPACE, Tag.BUILDING]}));
    expect(award.getScore(player)).to.eq(1);

    player.playedCards.push(fakeCard({tags: [Tag.SPACE, Tag.BUILDING], type: CardType.EVENT}));
    expect(award.getScore(player)).to.eq(1);
  });

  it('Compatible with Chimera', () => {
    // Chimera's two wild tags count as one tag of each type.
    player.playedCards.push(new Chimera());
    expect(award.getScore(player)).eq(1);

    player.playedCards.push(fakeCard({tags: [Tag.WILD]}));
    expect(award.getScore(player)).eq(1);

    player.playedCards.push(fakeCard({tags: [Tag.SPACE]}));
    expect(award.getScore(player)).eq(2);

    player.playedCards.push(fakeCard({tags: [Tag.SPACE]}));
    expect(award.getScore(player)).eq(3);
  });

  it('Counts events with Odyssey', () => {
    player.playedCards.push(new Odyssey());
    player.playedCards.push(fakeCard({tags: [Tag.SPACE], type: CardType.EVENT}));
    player.playedCards.push(fakeCard({tags: [Tag.SPACE], type: CardType.EVENT}));
    player.playedCards.push(fakeCard({tags: [], type: CardType.EVENT}));
    expect(award.getScore(player)).eq(3);
  });

  it('Counts events with Odyssey and Chimera', () => {
    player.playedCards.push(new Odyssey());
    player.playedCards.push(new Chimera());
    player.playedCards.push(fakeCard({tags: [], type: CardType.EVENT}));
    player.playedCards.push(fakeCard({tags: [], type: CardType.EVENT}));
    expect(award.getScore(player)).eq(3);
  });
});
