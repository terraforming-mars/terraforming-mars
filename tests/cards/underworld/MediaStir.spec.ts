import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {MediaStir} from '../../../src/server/cards/underworld/MediaStir';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('MediaStir', function() {
  let card: MediaStir;
  let player: TestPlayer;
  let game: IGame;
  let turmoil: Turmoil;

  beforeEach(() => {
    card = new MediaStir();
    [game, player] = testGame(2, {turmoilExtension: true});
    turmoil = Turmoil.getTurmoil(game);
  });

  const resolveTests = [
    {mc: 10, corruption: 0, influence: 0, expect: {tr: 21, mc: 10}},
    {mc: 10, corruption: 0, influence: 1, expect: {tr: 21, mc: 10}},
    {mc: 10, corruption: 0, influence: 2, expect: {tr: 21, mc: 10}},
    {mc: 10, corruption: 1, influence: 0, expect: {tr: 20, mc: 7}},
    {mc: 10, corruption: 1, influence: 1, expect: {tr: 20, mc: 10}},
    {mc: 10, corruption: 1, influence: 2, expect: {tr: 20, mc: 10}},
    {mc: 10, corruption: 2, influence: 0, expect: {tr: 20, mc: 4}},
    {mc: 10, corruption: 2, influence: 1, expect: {tr: 20, mc: 7}},
    {mc: 10, corruption: 2, influence: 2, expect: {tr: 20, mc: 10}},
    {mc: 10, corruption: 3, influence: 0, expect: {tr: 20, mc: 1}},
    {mc: 10, corruption: 3, influence: 1, expect: {tr: 20, mc: 4}},
    {mc: 10, corruption: 3, influence: 2, expect: {tr: 20, mc: 7}},
    {mc: 10, corruption: 4, influence: 0, expect: {tr: 20, mc: 0}},
  ] as const;

  for (const run of resolveTests) {
    it(`corruption: ${run.corruption}, influence: ${run.influence}`, () => {
      player.megaCredits = run.mc;
      turmoil.addInfluenceBonus(player, run.influence);
      player.underworldData.corruption = run.corruption;

      card.resolve(game, turmoil);

      expect(player.megaCredits).eq(run.expect.mc);
      expect(player.getTerraformRating()).eq(run.expect.tr);
    });
  }
});
