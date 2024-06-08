import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {MoonHabitatStandardProjectVariant1, MoonMineStandardProjectVariant1, MoonRoadStandardProjectVariant1} from '../../../src/server/cards/moon/MoonStandardProjectVariants1';

describe('MoonStandardProjectVariants1', () => {
  describe('MoonHabitatStandardProjectVariant1', () => {
    const canActRuns = [
      {titanium: 0, mc: 23, canAct: false},
      {titanium: 1, mc: 23, canAct: true},
      {titanium: 0, mc: 30, canAct: false},
      {titanium: 3, mc: 16, canAct: false},
      {titanium: 3, mc: 17, canAct: true},
    ] as const;
    for (const run of canActRuns) {
      it('can act' + JSON.stringify(run), () => {
        const [/* game */, player] = testGame(1, {moonExpansion: true, moonStandardProjectVariant1: true});
        const card = new MoonHabitatStandardProjectVariant1();
        player.titanium = run.titanium;
        player.megaCredits = run.mc;
        expect(card.canAct(player)).eq(run.canAct);
      });
    }
  });

  describe('MoonMineStandardProjectVariant1', () => {
    const canActRuns = [
      {titanium: 0, mc: 21, canAct: false},
      {titanium: 1, mc: 21, canAct: true},
      {titanium: 0, mc: 30, canAct: false},
      {titanium: 3, mc: 14, canAct: false},
      {titanium: 3, mc: 15, canAct: true},
    ] as const;
    for (const run of canActRuns) {
      it('can act' + JSON.stringify(run), () => {
        const [/* game */, player] = testGame(1, {moonExpansion: true, moonStandardProjectVariant1: true});
        const card = new MoonMineStandardProjectVariant1();
        player.titanium = run.titanium;
        player.megaCredits = run.mc;
        expect(card.canAct(player)).eq(run.canAct);
      });
    }
  });

  describe('MoonRoadStandardProjectVariant1', () => {
    const canActRuns = [
      {mc: 19, steel: 1, expected: true},
      {mc: 20, steel: 0, expected: false},
      {mc: 16, steel: 2, expected: false},
      {mc: 17, steel: 2, expected: true},
    ];
    for (const run of canActRuns) {
      it('can act ' + JSON.stringify(run), () => {
        const [/* game */, player] = testGame(1, {moonExpansion: true, moonStandardProjectVariant1: true});
        const card = new MoonRoadStandardProjectVariant1();
        player.steel = run.steel;
        player.megaCredits = run.mc;
        expect(card.canAct(player)).eq(run.expected);
      });
    }
  });
});

