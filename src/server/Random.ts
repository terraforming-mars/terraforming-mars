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
