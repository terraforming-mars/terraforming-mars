import {expect} from 'chai';
import {CountableUnits} from '../../src/server/behavior/Countable';
import {Tag} from '../../src/common/cards/Tag';

describe('Countable', () => {
  it('hasNegativeRawValues', () => {
    expect(CountableUnits.hasNegativeRawValues({})).is.false;
    expect(CountableUnits.hasNegativeRawValues({megacredits: 1})).is.false;
    expect(CountableUnits.hasNegativeRawValues({megacredits: -1})).is.true;
    expect(CountableUnits.hasNegativeRawValues({megacredits: 5, titanium: -2})).is.true;
    expect(CountableUnits.hasNegativeRawValues({megacredits: -1, heat: {tag: Tag.ANIMAL, per: -1}})).is.true;
    expect(CountableUnits.hasNegativeRawValues({heat: {tag: Tag.ANIMAL, per: -1}})).is.false;
  });
});
