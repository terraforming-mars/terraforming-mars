import {expect} from 'chai';
import * as utils from '../../../src/common/utils/utils';

describe('utils', function() {
  it('range', () => {
    expect(utils.range(10)).deep.eq([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
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
});
