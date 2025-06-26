import {expect} from 'chai';
import {CloudTourism} from '../../../src/server/cards/prelude2/CloudTourism';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {EarthEmbassy} from '../../../src/server/cards/moon/EarthEmbassy';

describe('CloudTourism', () => {
  const playTests = [
    {earth: 0, venus: 0, wild: 0, expected: 0},
    {earth: 0, venus: 1, wild: 0, expected: 0},
    {earth: 1, venus: 0, wild: 0, expected: 1},
    {earth: 1, venus: 1, wild: 0, expected: 1},
    {earth: 2, venus: 1, wild: 0, expected: 2},
    {earth: 2, venus: 2, wild: 0, expected: 2},
    {earth: 2, venus: 1, wild: 1, expected: 2},
    {earth: 3, venus: 1, wild: 1, expected: 3},
    {earth: 3, venus: 1, wild: 2, expected: 3},
    {earth: 3, venus: 1, wild: 3, expected: 4},
    {earth: 3, venus: 1, wild: 4, expected: 4},
  ] as const;
  for (const run of playTests) {
    it('play ' + JSON.stringify(run), () => {
      const card = new CloudTourism();
      const [game, player] = testGame(1);

      player.tagsForTest = {earth: run.earth, venus: run.venus, wild: run.wild};
      cast(card.play(player), undefined);
      runAllActions(game);

      expect(player.production.megacredits).eq(run.expected);

      runAllActions(game);
      cast(player.popWaitingFor(), undefined);
    });
  }

  const earthEmbassyPlayTests = [
    {earth: 0, venus: 4, played: false, moon: 4, expected: 0},
    {earth: 0, venus: 4, played: true, moon: 4, expected: 4},
    {earth: 2, venus: 4, played: true, moon: 1, expected: 3},
    {earth: 2, venus: 4, played: true, moon: 2, expected: 4},
    {earth: 2, venus: 4, played: true, moon: 3, expected: 5},
  ] as const;
  for (const run of earthEmbassyPlayTests) {
    it('play, compatible with earth embassy ' + JSON.stringify(run), () => {
      const card = new CloudTourism();
      const [game, player] = testGame(1, {moonExpansion: true});

      if (run.played) {
        player.playedCards.push(new EarthEmbassy());
      }
      player.tagsForTest = {earth: run.earth, venus: run.venus, moon: run.moon};
      cast(card.play(player), undefined);
      runAllActions(game);

      expect(player.production.megacredits).eq(run.expected);

      runAllActions(game);
      cast(player.popWaitingFor(), undefined);
    });
  }

  it('action', () => {
    const card = new CloudTourism();
    const [game, player] = testGame(1);

    expect(card.canAct(player)).is.true;
    cast(card.action(player), undefined);
    runAllActions(game);
    expect(card.resourceCount).eq(1);
  });
});
