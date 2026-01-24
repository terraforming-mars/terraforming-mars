import {Context} from '../routes/IHandler';

export type QuotaConfig = {
  limit: number;
  perMs: number;
}

export class QuotaHandler {
  private times = new Map<string, Array<number | undefined>>();

  private limit: number;
  private perMs: number;

  constructor(config: QuotaConfig) {
    this.limit = config.limit;
    this.perMs = config.perMs;
    console.log(`Initialzing quota handler with {limit: ${this.limit}, perMs: ${this.perMs}}`);
  }

  measure(ctx: Context): boolean {
    const ip = ctx.ip;
    const now = ctx.clock.now();

    const times = this.times.get(ip) || [];
    times.unshift(now);
    times.length = this.limit + 1; // Trims the end, keeps the array the right size. (There are more efficient ways to do this, especially in C.)
    this.times.set(ip, times);

    const earliest = now - this.perMs;
    const oldestInCache = times[times.length - 1];
    if (oldestInCache !== undefined && oldestInCache > earliest) {
      return false;
    }

    return true;
  }
}
