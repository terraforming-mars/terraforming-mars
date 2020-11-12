import {expect} from 'chai';
import {ELYSIUM_AWARDS, HELLAS_AWARDS, ORIGINAL_AWARDS, VENUS_AWARDS} from '../src/awards/Awards';
import {IAward} from '../src/awards/IAward';
import {buildSynergies, MA_ITEMS, computeSynergy, verifySynergyRules, MAX_SYNERGY_ALLOWED_RULE, TOTAL_SYNERGY_ALLOWED_RULE, NUM_HIGH_ALLOWED_RULE, HIGH_THRESHOLD_RULE} from '../src/MilestoneAwardSelector';
import {IMilestone} from '../src/milestones/IMilestone';
import {ELYSIUM_MILESTONES, HELLAS_MILESTONES, ORIGINAL_MILESTONES, VENUS_MILESTONES} from '../src/milestones/Milestones';

const SYNERGIES = [
  [1000, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 9, 2, 0, 0, 0, 0, 0],
  [0, 1000, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 4, 4, 0, 6, 0, 0, 0, 0, 0],
  [0, 0, 1000, 0, 0, 0, 0, 1, 0, 0, 0, 0, 4, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 4, 5, 2, 9, 0, 0, 0, 0, 0],
  [0, 0, 0, 1000, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 5, 0, 0, 9, 0],
  [0, 0, 0, 0, 1000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1000, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 2, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1000, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 4, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 1000, 0, 1, 1, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 1, 3, 2, 2],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1000, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1000, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 5, 2, 0, 3, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1000, 0, 0, 0, 0, 0, 3, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1000, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1, 3, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 5],

  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1000, 0, 0, 0, 0, 0, 0, 7, 7, 0, 8, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1000, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1000, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1000, 0, 0, 0, 0, 0, 1, 3, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1000, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1000, 5, 1, 7, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1000, 1, 8, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1000, 3, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1000, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1000, 2, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1000, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1000, 0, 2],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1000, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1000],
];

// @ts-ignore unused method except when wanting to dump the array as a list of bindings.
function _dumpSynergy() {
  function x(n: number) {
    return MA_ITEMS[n].constructor.name;
  }
  for (let row = 0; row < SYNERGIES.length; row++) {
    for (let col = 0; col < SYNERGIES[row].length; col++) {
      const weight = SYNERGIES[row][col];
      if (weight > 0 && weight < 1000) {
        console.log(`bind(${x(row)}, ${x(col)}, ${weight});`);
      }
    }
  }
  console.log('END');
}

function getMAIndices(...entries: Array<IMilestone | IAward>): Array<number> {
  const idxs = entries.map((entry) => MA_ITEMS.findIndex((ma) => entry.name === ma.name));
  return idxs;
}

describe('MilestoneAwardSelecter', function() {
  it('verify that hand-built synergies is the same as the predefined array', function() {
    // Synergies is built as a 2-d array where array[row][col] === array[col][row].
    // Erasing half of the values for the test to match the original array.
    function eraseMirror(array: Array<Array<number>>) {
      for (let row = 1; row < array.length; row++) {
        for (let col = 0; col < row; col++) {
          array[row][col] = 0;
        }
      }
    }

    const synergies = buildSynergies();
    eraseMirror(synergies);
    expect(synergies).is.eql(SYNERGIES);
  });

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
