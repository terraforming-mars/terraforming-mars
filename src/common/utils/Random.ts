/**
 * A serialized random generator, tagged by algorithm so an old save
 * (mulberry32, 32-bit state) and a new one (sfc32, 128-bit state) can both
 * be restored. Produced by each generator's `serialize()`, restored by {@link deserializeRandom}.
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
 * A seedable generator with 128 bits of state (sfc32). Unlike {@link SeededRandom}
 * (mulberry32), whose whole state is a single 32-bit word and so can be recovered
 * by trying all 2^32 possibilities against a handful of observed outputs, sfc32's
 * state is large enough that brute-forcing it from a game's visible cards is
 * infeasible. Used for live games so players cannot reconstruct the shuffle and
 * predict hidden cards. It is still a fast PRNG, not a cryptographic one, but its
 * output is not practically invertible from the little a player sees.
 *
 * The state is seeded from real entropy via {@link StrongRandom.fromEntropy} at game
 * creation, and round-trips through {@link StrongRandom.serialize} so a loaded game
 * continues the same sequence.
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
   * Builds a generator from four 32-bit words of entropy (e.g. `crypto.randomBytes(16)`),
   * then runs a short warm-up so weak seed words do not show through in early output.
   */
  public static fromEntropy(words: ReadonlyArray<number>): StrongRandom {
    if (words.length !== 4) {
      throw new Error(`StrongRandom needs exactly four words of entropy, got ${words.length}`);
    }
    const rng = new StrongRandom(words[0], words[1], words[2], words[3]);
    for (let i = 0; i < 15; i++) {
      rng.next();
    }
    return rng;
  }

  // sfc32 (Chris Doty-Humphrey's PractRand). 128-bit state, period at least 2^32.
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
