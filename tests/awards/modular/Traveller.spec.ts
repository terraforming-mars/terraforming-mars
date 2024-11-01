import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {Traveller} from '../../../src/server/awards/modular/Traveller';
import {fakeCard} from '../../TestingUtils';
import {Tag} from '../../../src/common/cards/Tag';
import {TestPlayer} from '../../TestPlayer';
import {CardType} from '../../../src/common/cards/CardType';
import {Chimera} from '../../../src/server/cards/pathfinders/Chimera';

describe('Traveller', () => {
  let award: Traveller;
  let player: TestPlayer;

  beforeEach(() => {
    award = new Traveller();
    [/* game */, player] = testGame(2);
  });

  it('Counts tags', () => {
    expect(award.getScore(player)).to.eq(0);

    player.playedCards.push(fakeCard({tags: [Tag.JOVIAN]}));
    expect(award.getScore(player)).to.eq(1);

    player.playedCards.push(fakeCard({tags: [Tag.EARTH]}));
    expect(award.getScore(player)).to.eq(2);

    player.playedCards.push(fakeCard({tags: [Tag.EARTH, Tag.EARTH, Tag.JOVIAN]}));
    expect(award.getScore(player)).to.eq(5);
  });

  it('Does NOT count wild tags', () => {
    expect(award.getScore(player)).to.eq(0);

    player.playedCards.push(fakeCard({tags: [Tag.JOVIAN, Tag.BUILDING]}));
    expect(award.getScore(player)).to.eq(1);

    player.playedCards.push(fakeCard({tags: [Tag.WILD]}));
    expect(award.getScore(player)).to.eq(1);
  });

  it('Does not count events', () => {
    expect(award.getScore(player)).to.eq(0);

    player.playedCards.push(fakeCard({tags: [Tag.EARTH, Tag.BUILDING]}));
    expect(award.getScore(player)).to.eq(1);

    player.playedCards.push(fakeCard({tags: [Tag.JOVIAN, Tag.BUILDING], type: CardType.EVENT}));
    expect(award.getScore(player)).to.eq(1);
  });

  it('Chimera Corp scenario', () => {
    // A wild tag counts as no tag when determiningAward winners, however for Chimera it should give +1 score
    player.corporations.push(new Chimera());
    player.playedCards = [];
    expect(award.getScore(player)).eq(1);

    player.playedCards.push(fakeCard({tags: [Tag.JOVIAN]}));
    expect(award.getScore(player)).eq(2);

    player.playedCards.push(fakeCard({tags: [Tag.ANIMAL]}));
    expect(award.getScore(player)).eq(2);

    player.playedCards.push(fakeCard({tags: [Tag.WILD]}));
    expect(award.getScore(player)).eq(2);

    player.playedCards.push(fakeCard({tags: [Tag.EARTH]}));
    expect(award.getScore(player)).eq(3);
  });
});
