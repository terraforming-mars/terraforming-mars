import {Context} from '../routes/IHandler';

export type QuotaConfig = {
  limit: number;
  perMs: number;
}

export class QuotaHandler {
  /** Most recent first, at most `limit` entries per ip. */
  private times = new Map<string, Array<number>>();

  private limit: number;
  private perMs: number;

  constructor(config: QuotaConfig) {
    this.limit = config.limit;
    this.perMs = config.perMs;
    console.log(`Initializing quota handler with {limit: ${this.limit}, perMs: ${this.perMs}}`);
  }

  /** Returns true when this request's ip has room for another request. Does not count against the quota. */
  isWithinQuota(ctx: Context): boolean {
    const times = this.times.get(ctx.ip) ?? [];
    if (times.length < this.limit) {
      return true;
    }
    const earliest = ctx.clock.now() - this.perMs;
    return times[this.limit - 1] <= earliest;
  }

  /** Counts this request against its ip's quota. */
  record(ctx: Context): void {
    const times = this.times.get(ctx.ip) ?? [];
    times.unshift(ctx.clock.now());
    times.length = Math.min(times.length, this.limit); // Trims the end, keeps the array the right size.
    this.times.set(ctx.ip, times);
  }
}
