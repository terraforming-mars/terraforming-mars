import {expect} from 'chai';
import {Biologist} from '../../../src/server/awards/terraCimmeria/Biologist';
import {TestPlayer} from '../../TestPlayer';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {fakeCard} from '../../TestingUtils';
import {Tag} from '../../../src/common/cards/Tag';
import {Chimera} from '../../../src/server/cards/pathfinders/Chimera';

describe('Biologist', () => {
  let award: Biologist;
  let player: TestPlayer;

  beforeEach(() => {
    award = new Biologist();
    const game = newTestGame(1);
    player = getTestPlayer(game, 0);
  });

  it('score', () => {
    player.playedCards = [];
    expect(award.getScore(player)).eq(0);
    player.playedCards.push(fakeCard({tags: [Tag.MICROBE]}));
    expect(award.getScore(player)).eq(1);
    player.playedCards.push(fakeCard({tags: [Tag.ANIMAL]}));
    expect(award.getScore(player)).eq(2);
    player.playedCards.push(fakeCard({tags: [Tag.PLANT]}));
    expect(award.getScore(player)).eq(3);
    player.playedCards.push(fakeCard({tags: [Tag.BUILDING]}));
    expect(award.getScore(player)).eq(3);
    player.playedCards.push(fakeCard({tags: [Tag.WILD]}));
    expect(award.getScore(player)).eq(3);
  });

  it('score, with Chimera', () => {
    player.corporations.push(new Chimera());
    player.playedCards = [];
    expect(award.getScore(player)).eq(1);
    player.playedCards.push(fakeCard({tags: [Tag.MICROBE]}));
    expect(award.getScore(player)).eq(2);
    player.playedCards.push(fakeCard({tags: [Tag.ANIMAL]}));
    expect(award.getScore(player)).eq(3);
    player.playedCards.push(fakeCard({tags: [Tag.PLANT]}));
    expect(award.getScore(player)).eq(4);
    player.playedCards.push(fakeCard({tags: [Tag.BUILDING]}));
    expect(award.getScore(player)).eq(4);
    player.playedCards.push(fakeCard({tags: [Tag.WILD]}));
    expect(award.getScore(player)).eq(4);
  });
});
