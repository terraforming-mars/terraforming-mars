import {VolunteerMiningInitiative} from '../../../src/server/cards/underworld/VolunteerMiningInitiative';
import {testGame} from '../../TestGame';
import {addCity, cast, runAllActions} from '../../TestingUtils';
import {assertIsExcavationAction} from '../../underworld/underworldAssertions';

describe('VolunteerMiningInitiative', () => {
  const runs = [
    {cities: 0, excavations: 0},
    {cities: 1, excavations: 0},
    {cities: 2, excavations: 0},
    {cities: 3, excavations: 1},
    {cities: 4, excavations: 1},
    {cities: 5, excavations: 1},
    {cities: 6, excavations: 2},
    {cities: 7, excavations: 2},
    {cities: 8, excavations: 2},
    {cities: 9, excavations: 3},
    {cities: 10, excavations: 3},
  ];
  for (const run of runs) {
    it('play ' + run.cities, () => {
      const card = new VolunteerMiningInitiative();
      const [game, player, player2] = testGame(2, {underworldExpansion: true});

      for (let idx = 0; idx < run.cities; idx++) {
        addCity(player2);
      }
      cast(card.play(player), undefined);
      runAllActions(game);

      for (let idx = 0; idx < run.excavations; idx++) {
        assertIsExcavationAction(player, player.popWaitingFor());
        runAllActions(game);
      }

      cast(player.popWaitingFor(), undefined);
    });
  }
});
