import {expect} from 'chai';
import {ShipmentToEarth} from '../../../src/server/cards/promo/ShipmentToEarth';
import {testGame} from '../../TestGame';
import {cast} from '../../../src/common/utils/utils';

describe('ShipmentToEarth', () => {
  const canPlayRuns = [
    {plants: 2, steel: 3, expected: false},
    {plants: 3, steel: 2, expected: false},
    {plants: 3, steel: 3, expected: true},
  ] as const;
  for (const run of canPlayRuns) {
    it('canPlay: ' + JSON.stringify(run), () => {
      const card = new ShipmentToEarth();
      const [/* game */, player] = testGame(2);

      player.megaCredits = card.cost;
      player.plants = run.plants;
      player.steel = run.steel;

      expect(player.canPlay(card)).eq(run.expected);
    });
  }

  it('play', () => {
    const card = new ShipmentToEarth();
    const [/* game */, player] = testGame(2);

    player.plants = 5;
    player.steel = 4;
    player.tagsForTest = {earth: 3};
    const tr = player.terraformRating;

    cast(card.play(player), undefined);

    expect(player.plants).eq(2);
    expect(player.steel).eq(1);
    expect(player.terraformRating).eq(tr + 3);
    expect(player.megaCredits).eq(6);
  });
});
