import {expect} from 'chai';
import {ELYSIUM_AWARDS, HELLAS_AWARDS, ORIGINAL_AWARDS, VENUS_AWARDS} from '../src/awards/Awards';
import {IAward} from '../src/awards/IAward';
import {MA_ITEMS, computeSynergy, verifySynergyRules, MAX_SYNERGY_ALLOWED_RULE, TOTAL_SYNERGY_ALLOWED_RULE, NUM_HIGH_ALLOWED_RULE, HIGH_THRESHOLD_RULE} from '../src/MilestoneAwardSelector';
import {IMilestone} from '../src/milestones/IMilestone';
import {ELYSIUM_MILESTONES, HELLAS_MILESTONES, ORIGINAL_MILESTONES, VENUS_MILESTONES} from '../src/milestones/Milestones';

function getMAIndices(...entries: Array<IMilestone | IAward>): Array<number> {
  const idxs = entries.map((entry) => MA_ITEMS.findIndex((ma) => entry.name === ma.name));
  return idxs;
}

describe('MilestoneAwardSelecter', function() {
  // These aren't particularly excellent tests as much as they help demonstrate
  // what the original maps, if selected in full, would have as a synergy.

  it('Tharsis\'s milestones and awards have high synergy', function() {
    // Gardener / Landlord have synergy 6.
    expect(computeSynergy(getMAIndices(...ORIGINAL_MILESTONES, ...ORIGINAL_AWARDS))).eq(6);
  });

  it('Elysium\'s milestones and awards have high synergy', function() {
    // DesertSettler / Estate Dealer has synergy 5.
    expect(computeSynergy(getMAIndices(...ELYSIUM_MILESTONES, ...ELYSIUM_AWARDS))).eq(5);
  });
  it('Hellas\'s milestones and awards have high synergy', function() {
    // Both pairs Polar Explorer / Cultivator and Rim Settler / Space Baron
    // have synergy 3.
    expect(computeSynergy(getMAIndices(...HELLAS_MILESTONES, ...HELLAS_AWARDS))).eq(3);
  });
  it('Venus\'s milestones and awards have high synergy', function() {
    // Hoverlord / Venuphine have synergy 5.
    expect(computeSynergy(getMAIndices(...VENUS_MILESTONES, ...VENUS_AWARDS))).eq(5);
  });

  it('Tharsis\'s milestones and awards break limited synergy rules', function() {
    // Tharsis milestones and awards has total synergy of 21 and break the rules.
    expect(verifySynergyRules(getMAIndices(...ORIGINAL_MILESTONES, ...ORIGINAL_AWARDS), MAX_SYNERGY_ALLOWED_RULE, TOTAL_SYNERGY_ALLOWED_RULE, NUM_HIGH_ALLOWED_RULE, HIGH_THRESHOLD_RULE)).eq(false);
  });

  it('Elysium\'s milestones and awards do not break limited synergy rules', function() {
    // Elysium milestones and awards has total synergy of 13 and two high pairs of 4 and 5.
    // This set does not break the rules.
    expect(verifySynergyRules(getMAIndices(...ELYSIUM_MILESTONES, ...ELYSIUM_AWARDS), MAX_SYNERGY_ALLOWED_RULE, TOTAL_SYNERGY_ALLOWED_RULE, NUM_HIGH_ALLOWED_RULE, HIGH_THRESHOLD_RULE)).eq(true);
  });

  it('Hellas\'s milestones and awards do not break limited synergy rules', function() {
    // Hellas milestones and awards has total synergy of 11 and no high pair. It does not break the rules.
    expect(verifySynergyRules(getMAIndices(...HELLAS_MILESTONES, ...HELLAS_AWARDS), MAX_SYNERGY_ALLOWED_RULE, TOTAL_SYNERGY_ALLOWED_RULE, NUM_HIGH_ALLOWED_RULE, HIGH_THRESHOLD_RULE)).eq(true);
  });

  it('Hellas\'s milestones and awards break stringent limited synergy rules', function() {
    // Hellas milestones and awards break rules if allowed no synergy whatsoever.
    expect(verifySynergyRules(getMAIndices(...HELLAS_MILESTONES, ...HELLAS_AWARDS), 0, 0, 0, HIGH_THRESHOLD_RULE)).eq(false);
  });
});
