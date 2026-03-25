import {expect} from 'chai';
import * as utils from '../../../src/common/utils/utils';
import {Tag} from '../../../src/common/cards/Tag';

describe('utils', () => {
  it('range', () => {
    expect(utils.range(10)).deep.eq([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it('intersection', () => {
    expect(utils.intersection([], [])).is.empty;
    expect(utils.intersection([1], [2, 3])).is.empty;
    expect(utils.intersection([1, 2, 3], [2, 3])).contains.members([2, 3]);
    expect(utils.intersection([1, 2, 3], [1, 3, 4, 2])).contains.members([2, 3]);
  });

  it('intersection preserves order of first array', () => {
    expect(utils.intersection([1, 2, 3], [3, 2, 1])).deep.eq([1, 2, 3]);
    expect(utils.intersection([3, 2, 1], [1, 2, 3])).deep.eq([3, 2, 1]);
  });

  it('hasIntersection', () => {
    expect(utils.hasIntersection([], [])).is.false;
    expect(utils.hasIntersection([1], [2, 3])).is.false;
    expect(utils.hasIntersection([1, 2, 3], [2, 3])).is.true;
    expect(utils.hasIntersection([1, 2, 3], [1, 3, 4, 2])).is.true;
  });

  it('inplaceRemove', () => {
    const array = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    utils.inplaceRemove(array, 'Tuesday');
    expect(array).deep.eq(['Monday', 'Wednesday', 'Thursday', 'Friday']);

    utils.inplaceRemove(array, 'Saturday');
    expect(array).deep.eq(['Monday', 'Wednesday', 'Thursday', 'Friday']);

    utils.inplaceRemove(array, 'Friday');
    expect(array).deep.eq(['Monday', 'Wednesday', 'Thursday']);

    utils.inplaceRemove(array, 'Monday');
    expect(array).deep.eq(['Wednesday', 'Thursday']);
  });

  it('partitions', () => {
    expect(utils.partition([], (x) => x)).eql([[], []]);
    expect(utils.partition([true], (x) => x)).eql([[true], []]);
    expect(utils.partition([true, true], (x) => x)).eql([[true, true], []]);
    expect(utils.partition([true, false], (x) => x)).eql([[true], [false]]);
    expect(utils.partition([false, true], (x) => x)).eql([[true], [false]]); // matching come first
    expect(utils.partition([0, 1, 2, 3], (x) => x % 2 === 0)).eql([[0, 2], [1, 3]]);
    expect(utils.partition([{a: 0}, {a: 1}, {a: 2}, {a: 3}], (x) => x.a % 2 === 0)).eql([[{a: 0}, {a: 2}], [{a: 1}, {a: 3}]]);
  });

  it('sum', () => {
    expect(utils.sum([1, 3, 4])).eq(8);
    expect(utils.sum([1, 4])).eq(5);
    expect(utils.sum([1, 4, -6])).eq(-1);
  });

  it('zip', () => {
    const a1 = ['a', 'b', 'c'];
    const b1 = [5, 4, 2];
    const zipped: Array<[string, number]> = utils.zip(a1, b1);
    expect(zipped).deep.eq([
      ['a', 5],
      ['b', 4],
      ['c', 2],
    ]);
  });

  it('oneWayDifference', () => {
    expect(utils.oneWayDifference([], [])).is.empty;
    expect(utils.oneWayDifference([1], [1])).is.empty;
    expect(utils.oneWayDifference([1], [2, 3])).deep.eq([1]);
    expect(utils.oneWayDifference([1, 2, 3], [2, 3])).deep.eq([1]);
    expect(utils.oneWayDifference([1, 2, 3], [1, 3, 4, 2])).deep.eq([]);
    expect(utils.oneWayDifference([1, 2, 3, 4], [1, 4, 2])).deep.eq([3]);
    expect(utils.oneWayDifference([1, 1], [1])).deep.eq([1]);
  });

  it('twoWayDifference', () => {
    expect(utils.twoWayDifference([], [])).is.empty;
    expect(utils.twoWayDifference([1], [1])).is.empty;
    expect(utils.twoWayDifference([1], [2, 3])).deep.eq([1, 2, 3]);
    expect(utils.twoWayDifference([1, 2, 3], [2, 3])).deep.eq([1]);
    expect(utils.twoWayDifference([1, 2, 3], [1, 3, 4, 2])).deep.eq([4]);
    expect(utils.twoWayDifference([1, 2, 3, 4], [1, 4, 2])).deep.eq([3]);
    expect(utils.twoWayDifference([1, 1], [1])).deep.eq([]);
    expect(utils.twoWayDifference([1, 2, 3], [2, 3, 4])).deep.eq([1, 4]);
  });

  it('deNull', () => {
    expect(utils.deNull([])).deep.eq([]);
    expect(utils.deNull([1])).deep.eq([1]);
    expect(utils.deNull([1, 2, 3, 4, 5])).deep.eq([1, 2, 3, 4, 5]);
    expect(utils.deNull([1, undefined, 3, 4, 5])).deep.eq([1, 3, 4, 5]);
    expect(utils.deNull([undefined])).deep.eq([]);
    expect(utils.deNull([undefined, 1, undefined])).deep.eq([1]);
    expect(utils.deNull([undefined, undefined])).deep.eq([]);
  });

  it('partialize', () => {
    expect(utils.partialize({})).deep.eq({});
    expect(utils.partialize({'a': 0})).deep.eq({});
    expect(utils.partialize({'a': 0, 'b': 1})).deep.eq({'b': 1});
  });

  it('getEnumKeys', () => {
    expect(utils.getEnumKeys(Tag)).deep.eq([
      'BUILDING',
      'SPACE',
      'SCIENCE',
      'POWER',
      'EARTH',
      'JOVIAN',
      'VENUS',
      'PLANT',
      'MICROBE',
      'ANIMAL',
      'CITY',
      'MOON',
      'MARS',
      'CRIME',
      'WILD',
      'EVENT',
      'CLONE',
    ]);
  });

  it('getEnumStringValues', () => {
    expect(utils.getEnumStringValues(Tag)).deep.eq([
      'building',
      'space',
      'science',
      'power',
      'earth',
      'jovian',
      'venus',
      'plant',
      'microbe',
      'animal',
      'city',
      'moon',
      'mars',
      'crime',
      'wild',
      'event',
      'clone',
    ]);
  });

  it('cast', () => {
    expect(utils.cast(undefined, undefined));
    expect(utils.cast([], Array));
    expect(() => utils.cast(undefined, Array)).to.throw();
  });
});
