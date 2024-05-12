import {expect} from 'chai';
import {AMAZONIS_PLANITIA_AWARDS, ARABIA_TERRA_AWARDS, ARES_AWARDS, ELYSIUM_AWARDS, HELLAS_AWARDS, MOON_AWARDS, TERRA_CIMMERIA_AWARDS, THARSIS_AWARDS, VASTITAS_BOREALIS_AWARDS, VENUS_AWARDS} from '../../src/server/awards/Awards';
import {AMAZONIS_PLANITIA_MILESTONES, ARABIA_TERRA_MILESTONES, ARES_MILESTONES, ELYSIUM_MILESTONES, HELLAS_MILESTONES, MOON_MILESTONES, TERRA_CIMMERIA_MILESTONES, THARSIS_MILESTONES, VASTITAS_BOREALIS_MILESTONES, VENUS_MILESTONES} from '../../src/server/milestones/Milestones';
import {IAward} from '../../src/server/awards/IAward';
import {chooseMilestonesAndAwards, LIMITED_SYNERGY, maximumSynergy, verifySynergyRules} from '../../src/server/ma/MilestoneAwardSelector';
import {IMilestone} from '../../src/server/milestones/IMilestone';
import {RandomMAOptionType} from '../../src/common/ma/RandomMAOptionType';
import {intersection} from '../../src/common/utils/utils';
import {DEFAULT_GAME_OPTIONS, GameOptions} from '../../src/server/game/GameOptions';
import {BoardName} from '../../src/common/boards/BoardName';

function toNames(list: Array<IMilestone | IAward>): Array<string> {
  return list.map((e) => e.name);
}

describe('MilestoneAwardSelector', () => {
  // These aren't particularly excellent tests as much as they help demonstrate
  // what the original maps, if selected in full, would have as a synergy.

  it('Tharsis milestones and awards have high synergy', () => {
    // Gardener / Landlord have synergy 6.
    expect(maximumSynergy(toNames([...THARSIS_MILESTONES, ...THARSIS_AWARDS]))).eq(6);
  });

  it('Elysium milestones and awards have high synergy', () => {
    // DesertSettler / Estate Dealer has synergy 5.
    expect(maximumSynergy(toNames([...ELYSIUM_MILESTONES, ...ELYSIUM_AWARDS]))).eq(5);
  });
  it('Hellas milestones and awards have high synergy', () => {
    // Both pairs Polar Explorer / Cultivator and Rim Settler / Space Baron
    // have synergy 3.
    expect(maximumSynergy(toNames([...HELLAS_MILESTONES, ...HELLAS_AWARDS]))).eq(3);
  });
  it('Venus milestones and awards have high synergy', () => {
    // Hoverlord / Venuphine have synergy 5.
    expect(maximumSynergy(toNames([...VENUS_MILESTONES, ...VENUS_AWARDS]))).eq(5);
  });

  it('Tharsis milestones and awards break limited synergy rules', () => {
    // Tharsis milestones and awards has total synergy of 21 and break the rules.
    expect(verifySynergyRules(
      toNames([...THARSIS_MILESTONES, ...THARSIS_AWARDS]),
      LIMITED_SYNERGY)).eq(false);
  });

  it('Elysium milestones and awards do not break limited synergy rules', () => {
    // Elysium milestones and awards has total synergy of 13 and two high pairs of 4 and 5.
    // This set does not break the rules.
    expect(verifySynergyRules(
      toNames([...ELYSIUM_MILESTONES, ...ELYSIUM_AWARDS]),
      LIMITED_SYNERGY)).eq(true);
  });

  it('Hellas milestones and awards do not break limited synergy rules', () => {
    // Hellas milestones and awards has total synergy of 11 and no high pair. It does not break the rules.
    expect(verifySynergyRules(
      toNames([...HELLAS_MILESTONES, ...HELLAS_AWARDS]),
      LIMITED_SYNERGY)).eq(true);
  });

  it('Hellas milestones and awards break stringent limited synergy rules', () => {
    // Hellas milestones and awards break rules if allowed no synergy whatsoever.
    expect(verifySynergyRules(
      toNames([...HELLAS_MILESTONES, ...HELLAS_AWARDS]),
      {
        highThreshold: 10,
        maxSynergyAllowed: 0,
        numberOfHighAllowed: 0,
        totalSynergyAllowed: 0,
      })).eq(false);
  });

  it('Main entrance point', () => {
    // These tests don't test results, they just make sure these calls don't fail.
    choose({randomMA: RandomMAOptionType.NONE});
  });
  it('Main entrance point - limited', () => {
    choose({randomMA: RandomMAOptionType.LIMITED});
  });
  it('Main entrance point - unlimited', () => {
    choose({randomMA: RandomMAOptionType.UNLIMITED});
    choose({randomMA: RandomMAOptionType.NONE, moonExpansion: true});
    choose({randomMA: RandomMAOptionType.LIMITED, moonExpansion: true});
    choose({randomMA: RandomMAOptionType.UNLIMITED, moonExpansion: true});
  });

  it('Main entrance point, Ares & Moon enabled', () => {
    // These tests don't test results, they just make sure these calls don't fail.
    choose({randomMA: RandomMAOptionType.NONE, aresExtension: true, moonExpansion: true});
  });
  it('Main entrance point, Ares & Moon enabled - limited', () => {
    choose({randomMA: RandomMAOptionType.LIMITED, aresExtension: true, moonExpansion: true});
  });
  it('Main entrance point, Ares & Moon enabled - unlimited', () => {
    choose({randomMA: RandomMAOptionType.UNLIMITED, aresExtension: true, moonExpansion: true});
  });

  it('Do not select fan milestones or awards when that feature is disabled', () => {
    const avoidedAwards = [
      ...ARES_AWARDS,
      ...MOON_AWARDS,
      ...AMAZONIS_PLANITIA_AWARDS,
      ...ARABIA_TERRA_AWARDS,
      ...TERRA_CIMMERIA_AWARDS,
      ...VASTITAS_BOREALIS_AWARDS].map((a) => a.name);
    const avoidedMilestones = [
      ...ARES_MILESTONES,
      ...MOON_MILESTONES,
      ...AMAZONIS_PLANITIA_MILESTONES,
      ...ARABIA_TERRA_MILESTONES,
      ...TERRA_CIMMERIA_MILESTONES,
      ...VASTITAS_BOREALIS_MILESTONES].map((a) => a.name);
    for (let idx = 0; idx < 10000; idx++) {
      const mas = choose({
        randomMA: RandomMAOptionType.UNLIMITED,
        includeFanMA: false,
      });

      expect(intersection(mas.awards.map((award) => award.name), avoidedAwards)).is.empty;
      expect(intersection(mas.milestones.map((milestone) => milestone.name), avoidedMilestones)).is.empty;
    }
  });

  it('Do not select expansion milestones or awards when they are not selected', () => {
    const avoidedAwards = toNames([...VENUS_AWARDS, ...ARES_AWARDS, ...MOON_AWARDS]);
    const avoidedMilestones = toNames([...VENUS_MILESTONES, ...ARES_MILESTONES, ...MOON_MILESTONES]);
    avoidedMilestones.push('Pioneer', 'Martian', 'Colonizer');
    avoidedAwards.push('Politician');
    for (let idx = 0; idx < 10000; idx++) {
      const mas = choose({
        randomMA: RandomMAOptionType.LIMITED,
        venusNextExtension: false,
        aresExtension: false,
        moonExpansion: false,
        coloniesExtension: false,
        turmoilExtension: false,
        includeFanMA: true,
      });

      expect(intersection(toNames(mas.awards), avoidedAwards)).is.empty;
      expect(intersection(toNames(mas.milestones), avoidedMilestones)).is.empty;
    }
  });

  it('novus maps with no randomness render correctly', () => {
    const mas = chooseMilestonesAndAwards({
      ...DEFAULT_GAME_OPTIONS,
      'aresExtension': true,
      'boardName': BoardName.TERRA_CIMMERIA_NOVUS,
      'includeVenusMA': true,
      'includeFanMA': false,
      'pathfindersExpansion': true,
      'randomMA': RandomMAOptionType.NONE,
      'venusNextExtension': true,
    });
    expect(mas.milestones).to.have.length(6);
    expect(mas.awards).to.have.length(6);
  });
  function choose(options: Partial<GameOptions>) {
    return chooseMilestonesAndAwards({...DEFAULT_GAME_OPTIONS, ...options});
  }
});
