import {expect} from 'chai';
import {awardManifest} from '../../src/server/awards/Awards';
import {milestoneManifest} from '../../src/server/milestones/Milestones';
import {chooseMilestonesAndAwards, getCandidates, LIMITED_SYNERGY, maximumSynergy, verifySynergyRules} from '../../src/server/ma/MilestoneAwardSelector';
import {RandomMAOptionType} from '../../src/common/ma/RandomMAOptionType';
import {intersection} from '../../src/common/utils/utils';
import {DEFAULT_GAME_OPTIONS, GameOptions} from '../../src/server/game/GameOptions';
import {BoardName} from '../../src/common/boards/BoardName';
import {AwardName} from '../../src/common/ma/AwardName';
import {MilestoneName} from '../../src/common/ma/MilestoneName';

describe('MilestoneAwardSelector', () => {
  const maximumSynergyRuns = [
    // Gardener / Landlord have synergy 6.
    {mas: [...milestoneManifest.boards[BoardName.THARSIS], ...awardManifest.boards[BoardName.THARSIS]], expected: 6},
    // DesertSettler / Estate Dealer has synergy 5.
    {mas: [...milestoneManifest.boards[BoardName.ELYSIUM], ...awardManifest.boards[BoardName.ELYSIUM]], expected: 5},
    // Both pairs Polar Explorer / Cultivator and Rim Settler / Space Baron
    // have synergy 3.
    {mas: [...milestoneManifest.boards[BoardName.HELLAS], ...awardManifest.boards[BoardName.HELLAS]], expected: 3},
    // Hoverlord / Venuphine have synergy 5.
    {mas: [...milestoneManifest.expansions['venus'], ...awardManifest.expansions['venus']], expected: 5},
  ] as const;
  // These aren't particularly excellent tests as much as they help demonstrate
  // what the original maps, if selected in full, would have as a synergy.
  maximumSynergyRuns.forEach((run, idx) => {
    it('Compute maximum synergy ' + idx, () => {
      const mas: ReadonlyArray<MilestoneName | AwardName> = run.mas;
      expect(maximumSynergy(mas)).to.eq(run.expected);
    });
  });

  const verifySynergyRuns = [
    // Tharsis milestones and awards has total synergy of 21 and break the rules.
    {milestones: milestoneManifest.boards[BoardName.THARSIS], awards: awardManifest.boards[BoardName.THARSIS], expected: false},
    // Elysium milestones and awards has total synergy of 13 and two high pairs of 4 and 5.
    // This set does not break the rules.
    {milestones: milestoneManifest.boards[BoardName.ELYSIUM], awards: awardManifest.boards[BoardName.ELYSIUM], expected: true},
    // Hellas milestones and awards has total synergy of 11 and no high pair. It does not break the rules.
    {milestones: milestoneManifest.boards[BoardName.HELLAS], awards: awardManifest.boards[BoardName.HELLAS], expected: true},
  ] as const;
  // These aren't particularly excellent tests as much as they help demonstrate
  // what the original maps, if selected in full, would have as a synergy.
  verifySynergyRuns.forEach((run, idx) => {
    it('Verify limited synergy ' + idx, () => {
      expect(verifySynergyRules(run.milestones, run.awards, LIMITED_SYNERGY)).to.eq(run.expected);
    });
  });

  it('Hellas milestones and awards break stringent limited synergy rules', () => {
    // Hellas milestones and awards break rules if allowed no synergy whatsoever.
    expect(verifySynergyRules(
      milestoneManifest.boards[BoardName.HELLAS], awardManifest.boards[BoardName.HELLAS],
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
      awardManifest.expansions['ares'],
      awardManifest.expansions['moon'],
      awardManifest.boards[BoardName.AMAZONIS],
      awardManifest.boards[BoardName.ARABIA_TERRA],
      awardManifest.boards[BoardName.TERRA_CIMMERIA],
      awardManifest.boards[BoardName.VASTITAS_BOREALIS]].flat();
    const avoidedMilestones = [
      milestoneManifest.expansions['ares'],
      milestoneManifest.expansions['moon'],
      milestoneManifest.boards[BoardName.AMAZONIS],
      milestoneManifest.boards[BoardName.ARABIA_TERRA],
      milestoneManifest.boards[BoardName.TERRA_CIMMERIA],
      milestoneManifest.boards[BoardName.VASTITAS_BOREALIS]].flat();
    for (let idx = 0; idx < 10000; idx++) {
      const mas = choose({
        randomMA: RandomMAOptionType.UNLIMITED,
        includeFanMA: false,
      });

      expect(intersection(mas.awards, avoidedAwards)).is.empty;
      expect(intersection(mas.milestones, avoidedMilestones)).is.empty;
    }
  });

  it('Do not select expansion milestones or awards when they are not selected', () => {
    const avoidedAwards: Array<AwardName> = [
      awardManifest.expansions['ares'],
      awardManifest.expansions['moon'],
      awardManifest.expansions['venus'],
      awardManifest.expansions['underworld'],
    ].flat();
    const avoidedMilestones = [
      milestoneManifest.expansions['ares'],
      milestoneManifest.expansions['moon'],
      milestoneManifest.expansions['venus'],
      milestoneManifest.expansions['underworld'],
    ].flat();

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

  it('Do not select Constructor when Colonies is not selected', () => {
    for (let idx = 0; idx < 10000; idx++) {
      const mas = chooseMilestonesAndAwards({
        ...DEFAULT_GAME_OPTIONS,
        coloniesExtension: false,
        randomMA: RandomMAOptionType.LIMITED,
      });
      expect(mas.awards).does.not.contain('Constructor');
    }
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

    expect(intersection(milestones, milestoneManifest.modular)).deep.eq([]);
    expect(intersection(awards, awardManifest.modular)).deep.eq([]);

    // Landlord is listed as modular, but should be included here.
    expect(awards).to.contain('Landlord');
  });

  function choose(options: Partial<GameOptions>) {
    return chooseMilestonesAndAwards({...DEFAULT_GAME_OPTIONS, ...options});
  }
});
