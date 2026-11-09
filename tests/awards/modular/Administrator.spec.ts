import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {fakeCard} from '../../TestingUtils';
import {Tag} from '../../../src/common/cards/Tag';
import {TestPlayer} from '../../TestPlayer';
import {CardType} from '../../../src/common/cards/CardType';
import {Administrator} from '../../../src/server/awards/modular/Administrator';
import {Chimera} from '../../../src/server/cards/pathfinders/Chimera';
import {fakeMarsBot} from '../../automa/FakeMarsBot';

describe('Administrator', () => {
  let award: Administrator;
  let player: TestPlayer;

  beforeEach(() => {
    award = new Administrator();
    [/* game */, player] = testGame(2);
  });

  it('Counts tags', () => {
    expect(award.getScore(player)).to.eq(0);

    player.playedCards.push(fakeCard({tags: []}));
    expect(award.getScore(player)).to.eq(1);

    player.playedCards.push(fakeCard({tags: []}));
    expect(award.getScore(player)).to.eq(2);

    player.playedCards.push(fakeCard({tags: [Tag.EARTH]}));
    expect(award.getScore(player)).to.eq(2);
  });

  it('Does count wild tags', () => {
    expect(award.getScore(player)).to.eq(0);

    player.playedCards.push(fakeCard({tags: []}));
    expect(award.getScore(player)).to.eq(1);

    player.playedCards.push(fakeCard({tags: [Tag.WILD]}));
    expect(award.getScore(player)).to.eq(2);
  });

  it('Does not count events', () => {
    expect(award.getScore(player)).to.eq(0);

    player.playedCards.push(fakeCard({tags: []}));
    expect(award.getScore(player)).to.eq(1);

    player.playedCards.push(fakeCard({tags: [], type: CardType.EVENT}));
    expect(award.getScore(player)).to.eq(1);
  });

  it('Compatible with Chimera', () => {
    // A wild tag counts as no tag when determining Award winners (via rulebook)
    player.playedCards.push(new Chimera());
    expect(award.getScore(player)).eq(1);

    player.playedCards.push(fakeCard({tags: []}));
    expect(award.getScore(player)).eq(2);

    player.playedCards.push(fakeCard({tags: [Tag.ANIMAL]}));
    expect(award.getScore(player)).eq(2);

    player.playedCards.push(fakeCard({tags: [Tag.WILD]}));
    expect(award.getScore(player)).eq(3);
  });

  it('MarsBot counts the tagless cards in its own played pile, plus 2', () => {
    // An event always has its event tag, even when `tags` is empty.
    const pile = [fakeCard({tags: []}), fakeCard({tags: [Tag.EARTH]}), fakeCard({type: CardType.EVENT, tags: []})];
    const bot = fakeMarsBot({playedProjectCards: pile});

    expect(award.marsBotScore(bot)).eq(3);
  });
});
