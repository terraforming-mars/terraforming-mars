import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {MigrationUnderground} from '../../../src/server/cards/underworld/MigrationUnderground';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {UnderworldExpansion} from '../../../src/server/underworld/UnderworldExpansion';

describe('MigrationUnderground', () => {
  let card: MigrationUnderground;
  let player: TestPlayer;
  let game: IGame;
  let turmoil: Turmoil;

  beforeEach(() => {
    card = new MigrationUnderground();
    [game, player] = testGame(2, {turmoilExtension: true, underworldExpansion: true});
    turmoil = Turmoil.getTurmoil(game);
  });

  const resolveTests = [
    {excavationMarkers: 0, influence: 0, expect: {mcProduction: 0}},
    {excavationMarkers: 0, influence: 1, expect: {mcProduction: 0}},
    {excavationMarkers: 0, influence: 2, expect: {mcProduction: 1}},
    {excavationMarkers: 1, influence: 0, expect: {mcProduction: 0}},
    {excavationMarkers: 1, influence: 1, expect: {mcProduction: 1}},
    {excavationMarkers: 1, influence: 2, expect: {mcProduction: 1}},
    {excavationMarkers: 1, influence: 3, expect: {mcProduction: 2}},
    {excavationMarkers: 2, influence: 0, expect: {mcProduction: 1}},
    {excavationMarkers: 2, influence: 1, expect: {mcProduction: 1}},
    {excavationMarkers: 2, influence: 2, expect: {mcProduction: 2}},
    {excavationMarkers: 2, influence: 3, expect: {mcProduction: 2}},
    {excavationMarkers: 3, influence: 0, expect: {mcProduction: 1}},
    {excavationMarkers: 3, influence: 1, expect: {mcProduction: 2}},
    {excavationMarkers: 3, influence: 2, expect: {mcProduction: 2}},
    {excavationMarkers: 3, influence: 3, expect: {mcProduction: 3}},

    // Shows max 5.
    {excavationMarkers: 10, influence: 0, expect: {mcProduction: 5}},
    {excavationMarkers: 10, influence: 1, expect: {mcProduction: 5}},
    {excavationMarkers: 10, influence: 2, expect: {mcProduction: 5}},
    {excavationMarkers: 10, influence: 3, expect: {mcProduction: 5}},
    {excavationMarkers: 10, influence: 4, expect: {mcProduction: 5}},
    {excavationMarkers: 10, influence: 5, expect: {mcProduction: 5}},
  ] as const;

  for (const run of resolveTests) {
    it(`excavation markers: ${run.excavationMarkers}, influence: ${run.influence}`, () => {
      turmoil.addInfluenceBonus(player, run.influence);

      const spaces = UnderworldExpansion.excavatableSpaces(player);
      for (let idx = 0; idx < run.excavationMarkers; idx++) {
        spaces[idx].excavator = player;
      }

      card.resolve(game, turmoil);

      expect(player.production.megacredits).eq(run.expect.mcProduction);
    });
  }
});
