import {expect} from 'chai';
import {ToscheStation} from '../../../src/server/cards/starwars/ToscheStation';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

const cases = [
  {energy: 1, spend: 1, expectedEnergy: 0, expectedPlants: 0},
  {energy: 2, spend: 1, expectedEnergy: 1, expectedPlants: 0},
  {energy: 2, spend: 2, expectedEnergy: 0, expectedPlants: 1},
  {energy: 5, max: 4, spend: 2, expectedEnergy: 3, expectedPlants: 1},
  {energy: 5, max: 4, spend: 4, expectedEnergy: 1, expectedPlants: 3},
];

describe('ToscheStation', () => {
  let card: ToscheStation;
  let player: TestPlayer;

  beforeEach(() => {
    card = new ToscheStation();
    [/* game */, player] = testGame(2, {starWarsExpansion: true});
  });

  it('Can act', () => {
    expect(card.canAct(player)).is.false;
    player.energy = 1;
    expect(card.canAct(player)).is.true;
  });

  function test(
    idx: number,
    testCase: {
      energy: number,
      max?: number;
      spend: number,
      expectedEnergy: number,
      expectedPlants: number,
    }) {
    it('' + idx, () => {
      player.energy = testCase.energy;
      player.plants = 0;
      const selectAmount = card.action(player);

      expect(selectAmount.max).eq(testCase.max ?? testCase.energy);

      selectAmount.cb(testCase.spend);

      expect(player.energy).eq(testCase.expectedEnergy);
      expect(player.plants).eq(testCase.expectedPlants);
    });
  }

  for (let idx = 0; idx < cases.length; idx++) {
    test(idx, cases[idx]);
  }
});
