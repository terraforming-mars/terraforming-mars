import {expect} from 'chai';
import {AlbedoPlants} from '../../../src/server/cards/promo/AlbedoPlants';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {fakeCard} from '../../TestingUtils';
import {Tag} from '../../../src/common/cards/Tag';

describe('AlbedoPlants', () => {
  let card: AlbedoPlants;
  let player: TestPlayer;

  beforeEach(() => {
    card = new AlbedoPlants();
    [/* game */, player] = testGame(1);
  });

  it('Should play', () => {
    card.play(player);
    expect(player.production.plants).to.eq(1);
    expect(player.plants).to.eq(1);
  });

  it('onCardPlayed: including this', () => {
    card.onCardPlayed(player, card);
    expect(player.heat).to.eq(3);
  });

  for (const run of [
    {tags: 0, expected: 0},
    {tags: 1, expected: 3},
    {tags: 2, expected: 6},
  ]) {
    it('onCardPlayed: ${run.tags} tags', () => {
      card.onCardPlayed(player, fakeCard({tags: Array(run.tags).fill(Tag.PLANT)}));
      expect(player.heat).to.eq(run.expected);
    });
  }
});
