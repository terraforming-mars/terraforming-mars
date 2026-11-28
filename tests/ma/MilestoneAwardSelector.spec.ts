import {expect} from 'chai';
import {awardManifest} from '../../src/server/awards/Awards';
import {milestoneManifest} from '../../src/server/milestones/Milestones';
import {BOARDS_WITHOUT_VOLCANIC_SPACES, chooseMilestonesAndAwards, getCandidates, LIMITED_SYNERGY, maximumSynergy, validateCustomMAExpansions, verifySynergyRules} from '../../src/server/ma/MilestoneAwardSelector';
import {RandomMAOptionType} from '../../src/common/ma/RandomMAOptionType';
import {intersection} from '../../src/common/utils/utils';
import {DEFAULT_GAME_OPTIONS, GameOptions} from '../../src/server/game/GameOptions';
import {BoardName} from '../../src/common/boards/BoardName';
import {AwardName} from '../../src/common/ma/AwardName';
import {MilestoneName} from '../../src/common/ma/MilestoneName';
import {GameSetup} from '../../src/server/GameSetup';
import {SeededRandom} from '../../src/common/utils/Random';

describe('MilestoneAwardSelector', () => {
  const maximumSynergyRuns = [
    // Gardener / Landlord have synergy 6.
    {mas: [...milestoneManifest.boards[BoardName.THARSIS], ...awardManifest.boards[BoardName.THARSIS]], expected: 6},
    // DesertSettler / Estate Dealer has synergy 5.
    {mas: [...milestoneManifest.boards[BoardName.ELYSIUM], ...awardManifest.boards[BoardName.ELYSIUM]], expected: 5},
    // Both pairs Polar Explorer / Cultivator and Rim Settler / Space Baron
    // have synergy 3.
    {mas: [...milestoneManifest.boards[BoardName.HELLAS], ...awardManifest.boards[BoardName.HELLAS]], expected: 3},
    // Hoverlord / Venuphile have synergy 5.
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
    {options: {randomMA: RandomMAOptionType.NONE, expansions: {...DEFAULT_GAME_OPTIONS.expansions, moon: true}}},
    {options: {randomMA: RandomMAOptionType.LIMITED, expansions: {...DEFAULT_GAME_OPTIONS.expansions, moon: true}}},
    {options: {randomMA: RandomMAOptionType.UNLIMITED, expansions: {...DEFAULT_GAME_OPTIONS.expansions, moon: true}}},
    {options: {randomMA: RandomMAOptionType.NONE, expansions: {...DEFAULT_GAME_OPTIONS.expansions, ares: true, moon: true}}},
    {options: {randomMA: RandomMAOptionType.LIMITED, expansions: {...DEFAULT_GAME_OPTIONS.expansions, ares: true, moon: true}}},
    {options: {randomMA: RandomMAOptionType.UNLIMITED, expansions: {...DEFAULT_GAME_OPTIONS.expansions, ares: true, moon: true}}},
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
    for (let idx = 0; idx < 1_000; idx++) {
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

    avoidedMilestones.push('Pioneer', 'Martian');
    avoidedAwards.push('T. Politician');
    const [milestones, awards] = getCandidates({...DEFAULT_GAME_OPTIONS,
      randomMA: RandomMAOptionType.LIMITED,
      expansions: {...DEFAULT_GAME_OPTIONS.expansions, venus: false, ares: false, moon: false, colonies: false, turmoil: false},
      includeFanMA: true,
    });

    expect(intersection(awards, avoidedAwards)).is.empty;
    expect(intersection(milestones, avoidedMilestones)).is.empty;
  });

  it('nova maps with no randomness render correctly', () => {
    const mas = chooseMilestonesAndAwards({
      ...DEFAULT_GAME_OPTIONS,
      'boardName': BoardName.TERRA_CIMMERIA_NOVA,
      'expansions': {...DEFAULT_GAME_OPTIONS.expansions, ares: true, pathfinders: true, venus: true},
      'includeFanMA': false,
      'randomMA': RandomMAOptionType.NONE,
    });
    expect(mas.milestones).to.have.length(8);
    expect(mas.awards).to.have.length(8);
  });

  it('manual milestones and awards come from customMA', () => {
    const customMA = {
      milestones: ['Terraformer', 'Gardener', 'Builder', 'Mayor', 'Planner'],
      awards: ['Banker', 'Scientist', 'Thermalist', 'Miner', 'Celebrity'],
    } as const;
    const mas = choose({boardName: BoardName.HELLAS, randomMA: RandomMAOptionType.MANUAL, customMA});
    expect(mas.milestones).deep.eq(customMA.milestones);
    expect(mas.awards).deep.eq(customMA.awards);
  });

  it('manual milestones and awards require customMA', () => {
    expect(() => choose({randomMA: RandomMAOptionType.MANUAL})).to.throw('require customMA');
  });

  it('validateCustomMAExpansions', () => {
    const customMA = {
      milestones: ['Terraformer', 'Gardener', 'Builder', 'Mayor', 'Planner'],
      awards: ['Banker', 'Scientist', 'Thermalist', 'Miner', 'Politician'],
    } as const;
    const expansions = {...DEFAULT_GAME_OPTIONS.expansions, turmoil: false};
    expect(() => validateCustomMAExpansions(customMA, expansions)).to.throw('Politician needs the Turmoil expansion');
    expect(() => validateCustomMAExpansions(customMA, {...expansions, turmoil: true})).to.not.throw();
    expect(() => validateCustomMAExpansions(undefined, expansions)).to.not.throw();
  });

  it('Do not select Constructor when Colonies is not selected', () => {
    for (let idx = 0; idx < 1_000; idx++) {
      const mas = chooseMilestonesAndAwards({
        ...DEFAULT_GAME_OPTIONS,
        expansions: {...DEFAULT_GAME_OPTIONS.expansions, colonies: false},
        randomMA: RandomMAOptionType.LIMITED,
      });
      expect(mas.awards).does.not.contain('Constructor');
    }
  });

  it('Do not select deprecated milestones or awards', () => {
    const [milestones, awards] = getCandidates({
      ...DEFAULT_GAME_OPTIONS,
      randomMA: RandomMAOptionType.UNLIMITED,
      includeFanMA: true,
    });

    const deprecatedMilestones = Object.keys(milestoneManifest.all).filter(
      (name) => milestoneManifest.all[name as MilestoneName].deprecated,
    );
    const deprecatedAwards = Object.keys(awardManifest.all).filter(
      (name) => awardManifest.all[name as AwardName].deprecated,
    );

    expect(intersection(milestones as Array<string>, deprecatedMilestones)).is.empty;
    expect(intersection(awards as Array<string>, deprecatedAwards)).is.empty;
  });

  it('BOARDS_WITHOUT_VOLCANIC_SPACES is accurate', () => {
    const expected = Object.values(BoardName).filter((boardName) => {
      const board = GameSetup.newBoard({...DEFAULT_GAME_OPTIONS, boardName}, new SeededRandom(0));
      return board.volcanicSpaceIds.length === 0;
    });
    expect(BOARDS_WITHOUT_VOLCANIC_SPACES).to.have.members(expected);
  });

  it('Modular MA excludes Geologist as a candidate on boards without volcanic spaces', () => {
    const [milestones] = getCandidates({
      ...DEFAULT_GAME_OPTIONS,
      boardName: BoardName.HELLAS,
      modularMA: true,
      randomMA: RandomMAOptionType.UNLIMITED,
    });
    expect(milestones).does.not.contain('Geologist');
  });

  it('Modular MA includes Geologist as a candidate on boards with volcanic spaces', () => {
    const [milestones] = getCandidates({
      ...DEFAULT_GAME_OPTIONS,
      boardName: BoardName.THARSIS,
      modularMA: true,
      randomMA: RandomMAOptionType.UNLIMITED,
    });
    expect(milestones).contains('Geologist');
  });

  it('Amazonis Planitia uses its own milestones and awards when not randomized', () => {
    const mas = choose({boardName: BoardName.AMAZONIS_PLANITIA, randomMA: RandomMAOptionType.NONE});
    expect(mas.milestones).deep.eq(milestoneManifest.boards[BoardName.AMAZONIS_PLANITIA]);
    expect(mas.awards).deep.eq(awardManifest.boards[BoardName.AMAZONIS_PLANITIA]);
  });

  function choose(options: Partial<GameOptions>) {
    return chooseMilestonesAndAwards({...DEFAULT_GAME_OPTIONS, ...options});
  }
});
