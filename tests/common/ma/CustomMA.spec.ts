import {expect} from 'chai';
import {CustomMA, validateCustomMA} from '../../../src/common/ma/CustomMA';
import {RandomMAOptionType} from '../../../src/common/ma/RandomMAOptionType';
import {MilestoneName} from '../../../src/common/ma/MilestoneName';
import {AwardName} from '../../../src/common/ma/AwardName';

describe('CustomMA', () => {
  const customMA: CustomMA = {
    milestones: ['Terraformer', 'Gardener', 'Builder', 'Mayor', 'Planner'],
    awards: ['Banker', 'Scientist', 'Thermalist', 'Miner', 'Celebrity'],
  };
  const MANUAL = RandomMAOptionType.MANUAL;

  it('valid', () => {
    expect(() => validateCustomMA(undefined, RandomMAOptionType.NONE)).to.not.throw();
    expect(() => validateCustomMA(customMA, MANUAL)).to.not.throw();
  });

  it('requires randomMA to be manual', () => {
    expect(() => validateCustomMA(customMA, RandomMAOptionType.NONE)).to.throw('customMA requires randomMA to be Manual');
    expect(() => validateCustomMA(customMA, RandomMAOptionType.LIMITED)).to.throw('customMA requires randomMA to be Manual');
    expect(() => validateCustomMA(undefined, MANUAL)).to.throw('randomMA Manual requires customMA');
    // From untrusted JSON.
    expect(() => validateCustomMA(null as unknown as CustomMA, MANUAL)).to.throw('randomMA Manual requires customMA');
  });

  it('requires arrays', () => {
    expect(() => validateCustomMA({milestones: customMA.milestones} as CustomMA, MANUAL)).to.throw('customMA requires milestones and awards arrays');
    expect(() => validateCustomMA('foo' as unknown as CustomMA, MANUAL)).to.throw('customMA requires milestones and awards arrays');
  });

  it('rejects unknown names', () => {
    expect(() => validateCustomMA({...customMA, milestones: ['Nope' as MilestoneName]}, MANUAL)).to.throw('Unknown milestone: Nope');
    expect(() => validateCustomMA({...customMA, awards: ['Nope' as AwardName]}, MANUAL)).to.throw('Unknown award: Nope');
  });

  it('rejects duplicates', () => {
    expect(() => validateCustomMA({...customMA, milestones: ['Terraformer', 'Terraformer']}, MANUAL)).to.throw('customMA has duplicate milestones');
    expect(() => validateCustomMA({...customMA, awards: ['Banker', 'Banker']}, MANUAL)).to.throw('customMA has duplicate awards');
  });

  it('size', () => {
    const tooMany: CustomMA = {
      milestones: [...customMA.milestones, 'Generalist', 'Specialist', 'Ecologist', 'Tycoon'],
      awards: [...customMA.awards, 'Industrialist', 'Benefactor', 'Contractor', 'Landlord'],
    };
    expect(() => validateCustomMA({...customMA, milestones: ['Terraformer', 'Gardener']}, MANUAL)).to.throw('You must have between 3 and 8 custom milestones');
    expect(() => validateCustomMA({...customMA, milestones: ['Terraformer', 'Gardener', 'Builder']}, MANUAL)).to.not.throw();
    expect(() => validateCustomMA({...customMA, milestones: tooMany.milestones.slice(0, 8)}, MANUAL)).to.not.throw();
    expect(() => validateCustomMA({...customMA, milestones: tooMany.milestones}, MANUAL)).to.throw('You must have between 3 and 8 custom milestones');
    expect(() => validateCustomMA({...customMA, awards: ['Banker']}, MANUAL)).to.throw('You must have between 3 and 8 custom awards');
    expect(() => validateCustomMA({...customMA, awards: tooMany.awards.slice(0, 8)}, MANUAL)).to.not.throw();
    expect(() => validateCustomMA({...customMA, awards: tooMany.awards}, MANUAL)).to.throw('You must have between 3 and 8 custom awards');
  });
});
