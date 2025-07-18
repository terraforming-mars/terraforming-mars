import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {SeismicPredictions} from '../../../src/server/cards/underworld/SeismicPredictions';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('SeismicPredictions', () => {
  let card: SeismicPredictions;
  let player: TestPlayer;
  let game: IGame;
  let turmoil: Turmoil;

  beforeEach(() => {
    card = new SeismicPredictions();
    [game, player] = testGame(1, {turmoilExtension: true, underworldExpansion: true});
    turmoil = Turmoil.getTurmoil(game);
  });

  const resolveTests = [
    {mc: 10, tags: 0, claimed: 0, influence: 0, expect: {mc: 10}},
    {mc: 10, tags: 0, claimed: 0, influence: 0, expect: {mc: 10}},
    {mc: 10, tags: 0, claimed: 0, influence: 1, expect: {mc: 10}},
    {mc: 10, tags: 1, claimed: 1, influence: 0, expect: {mc: 10}},
    {mc: 10, tags: 1, claimed: 0, influence: 1, expect: {mc: 10}},
    {mc: 10, tags: 0, claimed: 0, influence: 1, expect: {mc: 10}},
    {mc: 10, tags: 4, claimed: 3, influence: 0, expect: {mc: 8}},
    {mc: 10, tags: 4, claimed: 0, influence: 0, expect: {mc: 2}},
    {mc: 10, tags: 6, claimed: 0, influence: 0, expect: {mc: 0}},
    {mc: 10, tags: 6, claimed: 0, influence: 1, expect: {mc: 0}},
    {mc: 10, tags: 6, claimed: 0, influence: 2, expect: {mc: 2}},
    {mc: 10, tags: 6, claimed: 0, influence: 3, expect: {mc: 4}},
    {mc: 10, tags: 6, claimed: 1, influence: 3, expect: {mc: 6}},
    {mc: 10, tags: 6, claimed: 1, influence: 3, expect: {mc: 6}},
    {mc: 10, tags: 6, claimed: 5, influence: 3, expect: {mc: 10}},
  ] as const;

  resolveTests.forEach((run, idx) => {
    it(idx.toString() + ': ' + JSON.stringify(run), () => {
      player.megaCredits = run.mc;
      turmoil.addInfluenceBonus(player, run.influence);
      player.tagsForTest = {building: run.tags};
      for (let idx = 0; idx < run.claimed; idx++) {
        player.underworldData.tokens.push({token: 'nothing', shelter: false, active: false});
      }

      card.resolve(game, turmoil);

      expect(player.megaCredits).eq(run.expect.mc);

      // Expect the unclaimed tokens
      // Count the tokens in the pile
    });
  });
});
