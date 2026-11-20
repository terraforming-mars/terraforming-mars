import {expect} from 'chai';
import {SeededRandom, StrongRandom, deserializeRandom} from '../../../src/common/utils/Random';
import {range} from '../../../src/common/utils/utils';

describe('Random', () => {
  it('Seed is deterministic', () => {
    const rnd1 = new SeededRandom(449);
    const rnd2 = new SeededRandom(449);
    const v1 = range(10).map(() => rnd1.next());
    const v2 = range(10).map(() => rnd2.next());
    expect(v1).to.deep.eq(v2);
  });

  it('next stays within range', () => {
    const rnd = new SeededRandom(849_328_401);
    range(5_000).forEach(() => {
      const val = rnd.next();
      expect(val).is.gte(0);
      expect(val).is.lt(1);
    });
  });

  it('nextInt stays within range', () => {
    const rnd = new SeededRandom(849_328_401);
    range(5_000).forEach(() => {
      const val = rnd.nextInt(1_000);
      expect(val).is.gte(0);
      expect(val).is.lte(1_000);
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

  it('mulberry32 round-trips through serialize', () => {
    const rnd = new SeededRandom(449);
    range(5).forEach(() => rnd.next());
    const restored = deserializeRandom(rnd.serialize());
    const a = range(10).map(() => rnd.next());
    const b = range(10).map(() => restored.next());
    expect(a).to.deep.eq(b);
  });
});

describe('StrongRandom', () => {
  it('is deterministic from the same state', () => {
    const a = new StrongRandom(1, 2, 3, 4);
    const b = new StrongRandom(1, 2, 3, 4);
    expect(range(20).map(() => a.next())).to.deep.eq(range(20).map(() => b.next()));
  });

  it('next stays within [0, 1)', () => {
    const rnd = StrongRandom.fromEntropy([0xdeadbeef, 0x12345678, 0x9abcdef0, 0x0f1e2d3c]);
    range(5_000).forEach(() => {
      const val = rnd.next();
      expect(val).is.gte(0);
      expect(val).is.lt(1);
    });
  });

  it('round-trips through serialize, preserving the full 128-bit state', () => {
    const rnd = StrongRandom.fromEntropy([5, 6, 7, 8]);
    range(10).forEach(() => rnd.next());
    const data = rnd.serialize();
    expect(data.kind).to.eq('sfc32');
    if (data.kind === 'sfc32') {
      expect(data.state).to.have.length(4); // 128 bits, not the 32 of mulberry32
    }
    const restored = deserializeRandom(data);
    const a = range(20).map(() => rnd.next());
    const b = range(20).map(() => restored.next());
    expect(a).to.deep.eq(b);
  });

  it('fromEntropy rejects fewer than four words', () => {
    expect(() => StrongRandom.fromEntropy([1, 2, 3])).to.throw();
  });

  it('different entropy gives different streams', () => {
    const a = StrongRandom.fromEntropy([1, 2, 3, 4]);
    const b = StrongRandom.fromEntropy([1, 2, 3, 5]);
    expect(a.next()).to.not.eq(b.next());
  });
});
