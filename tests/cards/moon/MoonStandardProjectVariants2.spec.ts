import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {MoonHabitatStandardProjectVariant2, MoonMineStandardProjectVariant2, MoonRoadStandardProjectVariant2} from '../../../src/server/cards/moon/MoonStandardProjectVariants2';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {testRedsCosts} from '../../TestingUtils';

describe('MoonStandardProjectVariants2', () => {
  describe('MoonHabitatStandardProjectVariant2', () => {
    const canActRuns = [
      {titanium: 1, mc: 25, canAct: false},
      {titanium: 0, mc: 25, canAct: false},
      {titanium: 0, mc: 26, canAct: true},
    ] as const;
    for (const run of canActRuns) {
      it('can act' + JSON.stringify(run), () => {
        const [/* game */, player] = testGame(1, {moonExpansion: true, moonStandardProjectVariant: true});
        const card = new MoonHabitatStandardProjectVariant2();
        player.titanium = run.titanium;
        player.megaCredits = run.mc;
        expect(card.canAct(player)).eq(run.canAct);
      });
    }

    it('can act when Reds are in power', () => {
      const card = new MoonHabitatStandardProjectVariant2();
      const [game, player] = testGame(1, {moonExpansion: true, turmoilExtension: true, moonStandardProjectVariant: true});
      const moonData = MoonExpansion.moonData(game);

      testRedsCosts(() => card.canAct(player), player, card.cost, 3);
      moonData.habitatRate = 8;
      testRedsCosts(() => card.canAct(player), player, card.cost, 0);
    });
  });

  describe('MoonMineStandardProjectVariant2', () => {
    const canActRuns = [
      {titanium: 1, mc: 20, canAct: false},
      {titanium: 0, mc: 22, canAct: false},
      {titanium: 0, mc: 23, canAct: true},
    ] as const;
    for (const run of canActRuns) {
      it('can act' + JSON.stringify(run), () => {
        const [/* game */, player] = testGame(1, {moonExpansion: true, moonStandardProjectVariant: true});
        const card = new MoonMineStandardProjectVariant2();
        player.titanium = run.titanium;
        player.megaCredits = run.mc;
        expect(card.canAct(player)).eq(run.canAct);
      });
    }

    it('can act when Reds are in power', () => {
      const card = new MoonMineStandardProjectVariant2();
      const [game, player] = testGame(1, {moonExpansion: true, turmoilExtension: true, moonStandardProjectVariant: true});
      const moonData = MoonExpansion.moonData(game);

      testRedsCosts(() => card.canAct(player), player, card.cost, 3);
      moonData.miningRate = 8;
      testRedsCosts(() => card.canAct(player), player, card.cost, 0);
    });
  });

  describe('MoonRoadStandardProjectVariant2', () => {
    const canActRuns = [
      {steel: 1, mc: 18, canAct: false},
      {steel: 0, mc: 20, canAct: false},
      {steel: 0, mc: 23, canAct: true},
    ] as const;
    for (const run of canActRuns) {
      it('can act' + JSON.stringify(run), () => {
        const [/* game */, player] = testGame(1, {moonExpansion: true, moonStandardProjectVariant: true});
        const card = new MoonRoadStandardProjectVariant2();
        player.steel = run.steel;
        player.megaCredits = run.mc;
        expect(card.canAct(player)).eq(run.canAct);
      });
    }

    it('can act when Reds are in power', () => {
      const card = new MoonRoadStandardProjectVariant2();
      const [game, player] = testGame(1, {moonExpansion: true, turmoilExtension: true, moonStandardProjectVariant: true});
      const moonData = MoonExpansion.moonData(game);

      testRedsCosts(() => card.canAct(player), player, card.cost, 3);
      moonData.logisticRate = 8;
      testRedsCosts(() => card.canAct(player), player, card.cost, 0);
    });
  });
});

