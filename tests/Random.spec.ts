import {expect} from 'chai';
import {SeededRandom} from '../src/Random';
import {range} from '../src/common/utils/utils';

describe('Random', function() {
  it('Seed is deterministic', function() {
    const rnd1 = new SeededRandom(449);
    const rnd2 = new SeededRandom(449);
    const v1 = range(10).map(() => rnd1.next());
    const v2 = range(10).map(() => rnd2.next());
    expect(v1).to.deep.eq(v2);
  });

  it('next stays within range', function() {
    const rnd = new SeededRandom(849328401);
    range(10000).forEach(() => {
      const val = rnd.next();
      expect(val).is.gte(0);
      expect(val).is.lt(1);
    });
  });

  it('nextInt stays within range', function() {
    const rnd = new SeededRandom(849328401);
    range(10000).forEach(() => {
      const val = rnd.nextInt(1000);
      expect(val).is.gte(0);
      expect(val).is.lte(1000);
      expect(val).eq(Math.floor(val));
    });
  });

  it('can be serialized', () => {
    // Well, it's not actually serialized, but yeah.

    const first = new SeededRandom(0.4);
    const v1 = range(10).map(() => first.next());
    let second = new SeededRandom(0.4);
    const v2: typeof v1 = [];
    range(10).forEach(() => {
      v2.push(second.next());
      second = new SeededRandom(second.seed, second.current);
    });
    expect(v1).to.deep.eq(v2);
  });
});
