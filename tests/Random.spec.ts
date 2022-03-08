import {expect} from 'chai';
import {Random} from '../src/Random';
import {range} from '../src/common/utils/utils';

describe('Random', function() {
  it('Seed is deterministic', function() {
    const rnd1 = new Random(449);
    const rnd2 = new Random(449);
    const v1 = range(10).map(() => rnd1.next());
    const v2 = range(10).map(() => rnd2.next());
    expect(v1).to.deep.eq(v2);
  });

  it('next stays within range', function() {
    const rnd = new Random(849328401);
    range(10000).forEach(() => {
      const val = rnd.next();
      expect(val).is.gte(0);
      expect(val).is.lt(1);
    });
  });

  it('nextInt stays within range', function() {
    const rnd = new Random(849328401);
    range(10000).forEach(() => {
      const val = rnd.nextInt(1000);
      expect(val).is.gte(0);
      expect(val).is.lte(1000);
      expect(val).eq(Math.floor(val));
    });
  });

  it('can be serialized', () => {
    // Well, it's not actually serialized, but yeah.

    const first = new Random(0.4);
    const v1 = range(10).map(() => first.next());
    let second = new Random(0.4);
    const v2: typeof v1 = [];
    range(10).forEach(() => {
      v2.push(second.next());
      second = new Random(second.seed, second.current);
    });
    expect(v1).to.deep.eq(v2);
  });
});
