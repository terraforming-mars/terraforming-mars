import {expect} from 'chai';
import {partition} from '../../src/client/utils/utils';

describe('partitions', () => {
  it('sanity', () => {
    expect(partition([true], (x) => x)).eql([[true], []]);
    expect(partition([true, true], (x) => x)).eql([[true, true], []]);
    expect(partition([true, false], (x) => x)).eql([[true], [false]]);
    expect(partition([false, true], (x) => x)).eql([[true], [false]]); // matching come first
    expect(partition([0, 1, 2, 3], (x) => x % 2 === 0)).eql([[0, 2], [1, 3]]);
    expect(partition([{a: 0}, {a: 1}, {a: 2}, {a: 3}], (x) => x.a % 2 === 0)).eql([[{a: 0}, {a: 2}], [{a: 1}, {a: 3}]]);
  });

  it('error cases', () => {
    expect(partition([], (x) => x)).eql([[], []]);
  });
});
