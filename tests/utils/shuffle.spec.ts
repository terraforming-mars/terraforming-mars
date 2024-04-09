import {expect} from 'chai';
import {inplaceShuffle} from '../../src/server/utils/shuffle';
import {SeededRandom} from '../../src/common/utils/Random';

describe('shuffle function', () => {
  it('algorithmic preservation', () => {
    const array = [1, 2, 3, 4, 5];
    inplaceShuffle(array, new SeededRandom(1));
    expect(array).deep.eq([5, 3, 4, 1, 2]);
  });

  it('sanity', () => {
    const array = [1, 2, 3, 4, 5];
    const backup = [...array];
    const seed = Math.random();
    const rng = new SeededRandom(seed);
    inplaceShuffle(array, rng);

    // Check that the shuffled array has the same elements as the original array
    expect(array, `for seed ${seed}`).to.have.members(backup);
  });

  const sizeRuns = [
    {array: [], expected: 0},
    {array: [1], expected: 1},
    {array: [1, 2, 3], expected: 3},
  ] as const;
  for (const run of sizeRuns) {
    it('preserves length ' + JSON.stringify(run), () => {
      const copy = [...run.array];
      const seed = Math.random();
      const rng = new SeededRandom(seed);
      inplaceShuffle(copy, rng);
      expect(copy, `for seed ${seed}`).to.have.length(run.expected);
    });
  }
});
