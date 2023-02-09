import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {Curator} from '../../../src/server/awards/amazonisPlanitia/Curator';
import {fakeCard} from '../../TestingUtils';
import {Tag} from '../../../src/common/cards/Tag';
import {TestPlayer} from '../../TestPlayer';
import {CardType} from '../../../src/common/cards/CardType';

describe('Curator', () => {
  let award: Curator;
  let player: TestPlayer;

  beforeEach(() => {
    award = new Curator();
    player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, player2], player);
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

    player.playedCards.push(fakeCard({tags: [Tag.SPACE, Tag.BUILDING], cardType: CardType.EVENT}));
    expect(award.getScore(player)).to.eq(1);
  });
});
