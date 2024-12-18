import {expect} from 'chai';
import {AMAZONIS_PLANITIA_AWARDS, ARABIA_TERRA_AWARDS, ARES_AWARDS, ELYSIUM_AWARDS, HELLAS_AWARDS, MODULAR_AWARDS, MOON_AWARDS, TERRA_CIMMERIA_AWARDS, THARSIS_AWARDS, VASTITAS_BOREALIS_AWARDS, VENUS_AWARDS} from '../../src/server/awards/Awards';
import {AMAZONIS_PLANITIA_MILESTONES, ARABIA_TERRA_MILESTONES, ARES_MILESTONES, ELYSIUM_MILESTONES, HELLAS_MILESTONES, MODULAR_MILESTONES, MOON_MILESTONES, TERRA_CIMMERIA_MILESTONES, THARSIS_MILESTONES, VASTITAS_BOREALIS_MILESTONES, VENUS_MILESTONES} from '../../src/server/milestones/Milestones';
import {chooseMilestonesAndAwards, getCandidates, LIMITED_SYNERGY, maximumSynergy, verifySynergyRules} from '../../src/server/ma/MilestoneAwardSelector';
import {RandomMAOptionType} from '../../src/common/ma/RandomMAOptionType';
import {intersection, toName} from '../../src/common/utils/utils';
import {DEFAULT_GAME_OPTIONS, GameOptions} from '../../src/server/game/GameOptions';
import {BoardName} from '../../src/common/boards/BoardName';
import {AwardName} from '../../src/common/ma/AwardName';
import {IMilestone} from '../../src/server/milestones/IMilestone';
import {IAward} from '../../src/server/awards/IAward';

describe('MilestoneAwardSelector', () => {
  const maximumSynergyRuns = [
    // Gardener / Landlord have synergy 6.
    {mas: [...THARSIS_MILESTONES, ...THARSIS_AWARDS], expected: 6},
    // DesertSettler / Estate Dealer has synergy 5.
    {mas: [...ELYSIUM_MILESTONES, ...ELYSIUM_AWARDS], expected: 5},
    // Both pairs Polar Explorer / Cultivator and Rim Settler / Space Baron
    // have synergy 3.
    {mas: [...HELLAS_MILESTONES, ...HELLAS_AWARDS], expected: 3},
    // Hoverlord / Venuphine have synergy 5.
    {mas: [...VENUS_MILESTONES, ...VENUS_AWARDS], expected: 5},
  ] as const;
  // These aren't particularly excellent tests as much as they help demonstrate
  // what the original maps, if selected in full, would have as a synergy.
  maximumSynergyRuns.forEach((run, idx) => {
    it('Compute maximum synergy ' + idx, () => {
      const mas: ReadonlyArray<IMilestone | IAward> = run.mas;
      expect(maximumSynergy(mas.map(toName))).to.eq(run.expected);
    });
  });

  const verifySynergyRuns = [
    // Tharsis milestones and awards has total synergy of 21 and break the rules.
    {mas: [...THARSIS_MILESTONES, ...THARSIS_AWARDS], expected: false},
    // Elysium milestones and awards has total synergy of 13 and two high pairs of 4 and 5.
    // This set does not break the rules.
    {mas: [...ELYSIUM_MILESTONES, ...ELYSIUM_AWARDS], expected: true},
    // Hellas milestones and awards has total synergy of 11 and no high pair. It does not break the rules.
    {mas: [...HELLAS_MILESTONES, ...HELLAS_AWARDS], expected: true},
  ] as const;
  // These aren't particularly excellent tests as much as they help demonstrate
  // what the original maps, if selected in full, would have as a synergy.
  verifySynergyRuns.forEach((run, idx) => {
    it('Verify limited synergy ' + idx, () => {
      const mas: ReadonlyArray<IMilestone | IAward> = run.mas;
      expect(verifySynergyRules(mas.map(toName), LIMITED_SYNERGY)).to.eq(run.expected);
    });
  });

  it('Hellas milestones and awards break stringent limited synergy rules', () => {
    // Hellas milestones and awards break rules if allowed no synergy whatsoever.
    expect(verifySynergyRules(
      [...HELLAS_MILESTONES, ...HELLAS_AWARDS].map(toName),
      {
        highThreshold: 10,
        maxSynergyAllowed: 0,
        numberOfHighAllowed: 0,
        totalSynergyAllowed: 0,
      })).eq(false);
  });

  const sanityTestRuns = [
    {options: {randomMA: RandomMAOptionType.NONE}},
    {options: {randomMA: RandomMAOptionType.LIMITED}},
    {options: {randomMA: RandomMAOptionType.UNLIMITED}},
    {options: {randomMA: RandomMAOptionType.NONE, moonExpansion: true}},
    {options: {randomMA: RandomMAOptionType.LIMITED, moonExpansion: true}},
    {options: {randomMA: RandomMAOptionType.UNLIMITED, moonExpansion: true}},
    {options: {randomMA: RandomMAOptionType.NONE, aresExtension: true, moonExpansion: true}},
    {options: {randomMA: RandomMAOptionType.LIMITED, aresExtension: true, moonExpansion: true}},
    {options: {randomMA: RandomMAOptionType.UNLIMITED, aresExtension: true, moonExpansion: true}},
  ] as const;
  sanityTestRuns.forEach((run, idx) => {
    it('sanity test run ' + idx, () => {
      // These tests don't test results, they just make sure these calls don't fail.
      choose(run.options);
    });
  });

  it('Do not select fan milestones or awards when that feature is disabled', () => {
    const avoidedAwards = [
      ...ARES_AWARDS,
      ...MOON_AWARDS,
      ...AMAZONIS_PLANITIA_AWARDS,
      ...ARABIA_TERRA_AWARDS,
      ...TERRA_CIMMERIA_AWARDS,
      ...VASTITAS_BOREALIS_AWARDS].map(toName);
    const avoidedMilestones = [
      ...ARES_MILESTONES,
      ...MOON_MILESTONES,
      ...AMAZONIS_PLANITIA_MILESTONES,
      ...ARABIA_TERRA_MILESTONES,
      ...TERRA_CIMMERIA_MILESTONES,
      ...VASTITAS_BOREALIS_MILESTONES].map(toName);
    for (let idx = 0; idx < 10000; idx++) {
      const mas = choose({
        randomMA: RandomMAOptionType.UNLIMITED,
        includeFanMA: false,
      });

      expect(intersection(mas.awards.map(toName), avoidedAwards)).is.empty;
      expect(intersection(mas.milestones.map(toName), avoidedMilestones)).is.empty;
    }
  });

  it('Do not select expansion milestones or awards when they are not selected', () => {
    const avoidedAwards: Array<AwardName> = [...VENUS_AWARDS, ...ARES_AWARDS, ...MOON_AWARDS].map(toName);
    const avoidedMilestones = [...VENUS_MILESTONES, ...ARES_MILESTONES, ...MOON_MILESTONES].map(toName);
    avoidedMilestones.push('Pioneer', 'Martian', 'Colonizer');
    avoidedAwards.push('T. Politician');
    const [milestones, awards] = getCandidates({...DEFAULT_GAME_OPTIONS,
      randomMA: RandomMAOptionType.LIMITED,
      venusNextExtension: false,
      aresExtension: false,
      moonExpansion: false,
      coloniesExtension: false,
      turmoilExtension: false,
      includeFanMA: true,
    });

    expect(intersection(awards, avoidedAwards)).is.empty;
    expect(intersection(milestones, avoidedMilestones)).is.empty;
  });

  it('novus maps with no randomness render correctly', () => {
    const mas = chooseMilestonesAndAwards({
      ...DEFAULT_GAME_OPTIONS,
      'aresExtension': true,
      'boardName': BoardName.TERRA_CIMMERIA_NOVUS,
      'includeFanMA': false,
      'pathfindersExpansion': true,
      'randomMA': RandomMAOptionType.NONE,
      'venusNextExtension': true,
    });
    expect(mas.milestones).to.have.length(6);
    expect(mas.awards).to.have.length(6);
  });

  it('No modular milestones and awards by default', () => {
    const [milestones, awards] = getCandidates({...DEFAULT_GAME_OPTIONS,
      randomMA: RandomMAOptionType.UNLIMITED,
      venusNextExtension: true,
      aresExtension: true,
      moonExpansion: true,
      coloniesExtension: true,
      turmoilExtension: true,
      includeFanMA: true,
    });

    expect(intersection(milestones, MODULAR_MILESTONES.map(toName))).deep.eq([]);
    expect(intersection(awards, MODULAR_AWARDS.map(toName))).deep.eq([]);

    // Landlord is listed as modular, but should be included here.
    expect(awards).to.contain('Landlord');
  });

  function choose(options: Partial<GameOptions>) {
    return chooseMilestonesAndAwards({...DEFAULT_GAME_OPTIONS, ...options});
  }
});
