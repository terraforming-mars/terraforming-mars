import {expect} from 'chai';
import {awardNames} from '../../src/common/ma/AwardName';
import {milestoneNames} from '../../src/common/ma/MilestoneName';
import {synergies} from '../../src/server/ma/MilestoneAwardSynergies';

describe('MilestoneAwardSynergies', () => {
  it('is symmetric', () => {
    const names = [...milestoneNames, ...awardNames];
    const asymmetric: Array<string> = [];
    for (const a of names) {
      for (const b of names) {
        if (synergies.get(a, b) !== synergies.get(b, a)) {
          asymmetric.push(`${a} | ${b}`);
        }
      }
    }
    expect(asymmetric).deep.eq([]);
  });
});
