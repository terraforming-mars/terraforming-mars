export class Random {
  private seed = 0;

  constructor(seed = 0) {
    this.seed = Math.floor(seed * 4294967296);
  }

  // https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
  // generate random float in [0,1) with seed
  public next(): number {
    let t = this.seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }

  public nextInt(range: number): number {
    return Math.floor(this.next() * range);
  }
}
