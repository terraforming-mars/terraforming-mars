import {expect} from 'chai';
import {ELYSIUM_AWARDS, HELLAS_AWARDS, ORIGINAL_AWARDS, VENUS_AWARDS} from '../src/awards/Awards';
import {IAward} from '../src/awards/IAward';
import {MilestoneAwardSelector} from '../src/MilestoneAwardSelector';
import {IMilestone} from '../src/milestones/IMilestone';
import {ELYSIUM_MILESTONES, HELLAS_MILESTONES, ORIGINAL_MILESTONES, VENUS_MILESTONES} from '../src/milestones/Milestones';

function toNames(list: Array<IMilestone | IAward>): Array<string> {
  return list.map((e) => e.name);
}

describe('MilestoneAwardSelector', function() {
  // These aren't particularly excellent tests as much as they help demonstrate
  // what the original maps, if selected in full, would have as a synergy.

  it('Tharsis milestones and awards have high synergy', function() {
    // Gardener / Landlord have synergy 6.
    expect(MilestoneAwardSelector.maximumSynergy(toNames([...ORIGINAL_MILESTONES, ...ORIGINAL_AWARDS]))).eq(6);
  });

  it('Elysium milestones and awards have high synergy', function() {
    // DesertSettler / Estate Dealer has synergy 5.
    expect(MilestoneAwardSelector.maximumSynergy(toNames([...ELYSIUM_MILESTONES, ...ELYSIUM_AWARDS]))).eq(5);
  });
  it('Hellas milestones and awards have high synergy', function() {
    // Both pairs Polar Explorer / Cultivator and Rim Settler / Space Baron
    // have synergy 3.
    expect(MilestoneAwardSelector.maximumSynergy(toNames([...HELLAS_MILESTONES, ...HELLAS_AWARDS]))).eq(3);
  });
  it('Venus milestones and awards have high synergy', function() {
    // Hoverlord / Venuphine have synergy 5.
    expect(MilestoneAwardSelector.maximumSynergy(toNames([...VENUS_MILESTONES, ...VENUS_AWARDS]))).eq(5);
  });

  it('Tharsis milestones and awards break limited synergy rules', function() {
    // Tharsis milestones and awards has total synergy of 21 and break the rules.
    expect(MilestoneAwardSelector.verifySynergyRules(
      toNames([...ORIGINAL_MILESTONES, ...ORIGINAL_AWARDS]),
      MilestoneAwardSelector.LIMITED_SYNERGY)).eq(false);
  });

  it('Elysium milestones and awards do not break limited synergy rules', function() {
    // Elysium milestones and awards has total synergy of 13 and two high pairs of 4 and 5.
    // This set does not break the rules.
    expect(MilestoneAwardSelector.verifySynergyRules(
      toNames([...ELYSIUM_MILESTONES, ...ELYSIUM_AWARDS]),
      MilestoneAwardSelector.LIMITED_SYNERGY)).eq(true);
  });

  it('Hellas milestones and awards do not break limited synergy rules', function() {
    // Hellas milestones and awards has total synergy of 11 and no high pair. It does not break the rules.
    expect(MilestoneAwardSelector.verifySynergyRules(
      toNames([...HELLAS_MILESTONES, ...HELLAS_AWARDS]),
      MilestoneAwardSelector.LIMITED_SYNERGY)).eq(true);
  });

  it('Hellas milestones and awards break stringent limited synergy rules', function() {
    // Hellas milestones and awards break rules if allowed no synergy whatsoever.
    expect(MilestoneAwardSelector.verifySynergyRules(
      toNames([...HELLAS_MILESTONES, ...HELLAS_AWARDS]),
      {
        highThreshold: 10,
        maxSynergyAllowed: 0,
        numberOfHighAllowed: 0,
        totalSynergyAllowed: 0,
      })).eq(false);
  });
});
