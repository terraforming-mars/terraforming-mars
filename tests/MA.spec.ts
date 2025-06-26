import {expect} from 'chai';
import {MultiSet} from 'mnemonist';
import {AwardName, awardNames} from '../src/common/ma/AwardName';
import {MilestoneName, milestoneNames} from '../src/common/ma/MilestoneName';

describe('MA', () => {
  it('Award names and Milestone names are distinct', () => {
    const counts: MultiSet<MilestoneName | AwardName> = MultiSet.from([...awardNames, ...milestoneNames]);
    const filtered = Array.from(counts.multiplicities()).filter((e) => e[1] > 1);
    expect(filtered.map((e) => e[0])).to.deep.eq([]);
  });
});
