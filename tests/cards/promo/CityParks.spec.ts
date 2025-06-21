import {expect} from 'chai';
import {CityParks} from '../../../src/server/cards/promo/CityParks';
import {addCity, cast} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('CityParks', () => {
  let card: CityParks;
  let player: TestPlayer;
  let opponent: TestPlayer;

  beforeEach(() => {
    card = new CityParks();
    [/* game*/, player, opponent] = testGame(2);
  });

  const canPlayRuns = [
    {cities: 0, opponentCities: 0, expected: false},
    {cities: 2, opponentCities: 3, expected: false},
    {cities: 3, opponentCities: 0, expected: true},
  ] as const;
  for (const run of canPlayRuns) {
    it('canplay ' + JSON.stringify(run), () => {
      for (let idx = 0; idx < run.cities; idx++) {
        addCity(player);
      }
      for (let idx = 0; idx < run.opponentCities; idx++) {
        addCity(opponent);
      }
      expect(card.canPlay(player)).eq(run.expected);
    });
  }

  it('play', () => {
    player.plants = 0;
    cast(card.play(player), undefined);
    expect(player.plants).eq(2);
  });
});
