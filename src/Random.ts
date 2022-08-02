export abstract class Random {
  public abstract next(): number;

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
  public static INSTANCE = new UnseededRandom();

  private constructor() {
    super();
  }

  public next(): number {
    return Math.random();
  }
}
