/**
 * A serialized random generator, tagged by algorithm so saves from either
 * {@link SeededRandom} or {@link StrongRandom} can be restored. Produced by each
 * generator's `serialize()`, restored by {@link deserializeRandom}.
 */
export type SerializedRandom =
  | {kind: 'mulberry32', seed: number, current: number}
  | {kind: 'sfc32', state: [number, number, number, number]};

export abstract class Random {
  public abstract next(): number;

  /**
   * Returns a random number between 0 and `range - 1`
   * @param {number} range upper bound random number, exclusive.
   * @return {number} a random number between 0 and `range - 1`
   */
  public nextInt(range: number): number {
    return Math.floor(this.next() * range);
  }
}
/**
 * A seedable generator using mulberry32, which keeps its whole state in one 32-bit word.
 * Deterministic from its seed, which makes it right for tests and for restoring older
 * saves, but a 32-bit state can be brute-forced from a few observed outputs, so live games
 * use {@link StrongRandom}.
 */
export class SeededRandom extends Random {
  public readonly seed;
  private currentSeed: number;

  constructor(seed = 0, currentSeed?: number) {
    super();
    this.seed = seed;
    this.currentSeed = currentSeed ?? Math.floor(seed * 4294967296);
  }

  public get current(): number {
    return this.currentSeed;
  }

  // https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
  // generate random float in [0,1) with seed
  public next(): number {
    let t = this.currentSeed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }

  public serialize(): SerializedRandom {
    return {kind: 'mulberry32', seed: this.seed, current: this.currentSeed};
  }
}

/**
 * A seedable generator with 128 bits of state, using sfc32 ("small fast counter").
 * A game's visible cards reveal enough of {@link SeededRandom}'s 32-bit state to recover
 * it, so a player could predict hidden cards. Brute-forcing 128 bits from the same
 * observations is infeasible. It is a fast PRNG, not a cryptographic one.
 *
 * Reference: https://github.com/bryc/code/blob/master/jshash/PRNGs.md#sfc32
 */
export class StrongRandom extends Random {
  private a: number;
  private b: number;
  private c: number;
  private d: number;

  constructor(a: number, b: number, c: number, d: number) {
    super();
    this.a = a >>> 0;
    this.b = b >>> 0;
    this.c = c >>> 0;
    this.d = d >>> 0;
  }

  /**
   * Creates a generator from four 32-bit seed words. With no words, draws them from
   * `crypto.getRandomValues`.
   *
   * Like the reference seeding, this discards the first 15 outputs. The state starts as the
   * raw seed words, and each output mixes them further, so a weak seed (for example small
   * integers) does not show in the first outputs. The reference seeds three words, sets the
   * counter to 1 and discards 15 outputs (12 when seeding from one 64-bit value); see the
   * link on {@link StrongRandom}. Restoring a serialized generator uses the constructor and
   * does not discard.
   */
  public static newInstance(words: ArrayLike<number> = crypto.getRandomValues(new Uint32Array(4))): StrongRandom {
    if (words.length !== 4) {
      throw new Error(`StrongRandom needs exactly four words, got ${words.length}`);
    }
    const rng = new StrongRandom(words[0], words[1], words[2], words[3]);
    for (let i = 0; i < 15; i++) {
      rng.next();
    }
    return rng;
  }

  // sfc32, from Chris Doty-Humphrey's PractRand. 128-bit state, period at least 2^32.
  public next(): number {
    const t = (this.a + this.b | 0) + this.d | 0;
    this.d = this.d + 1 | 0;
    this.a = this.b ^ this.b >>> 9;
    this.b = this.c + (this.c << 3) | 0;
    this.c = (this.c << 21 | this.c >>> 11) + t | 0;
    return (t >>> 0) / 4294967296;
  }

  public serialize(): SerializedRandom {
    return {kind: 'sfc32', state: [this.a >>> 0, this.b >>> 0, this.c >>> 0, this.d >>> 0]};
  }
}

/** The seedable, serializable generators a game may run on. */
export type GameRandom = SeededRandom | StrongRandom;

/** Restores a generator from its {@link SerializedRandom} form (either algorithm). */
export function deserializeRandom(data: SerializedRandom): GameRandom {
  switch (data.kind) {
  case 'mulberry32':
    return new SeededRandom(data.seed, data.current);
  case 'sfc32':
    return new StrongRandom(data.state[0], data.state[1], data.state[2], data.state[3]);
  }
}

export class UnseededRandom extends Random {
  public static readonly INSTANCE = new UnseededRandom();

  public next(): number {
    return Math.random();
  }
}

export class ConstRandom extends Random {
  private readonly float: number;
  constructor(float: number) {
    super();
    if (float < 0 || float > 1) {
      throw new Error('Supply a value between 0 and 1.');
    }
    this.float = float;
  }
  public next(): number {
    return this.float;
  }
}
