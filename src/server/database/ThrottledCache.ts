import {Clock} from '@/common/Timer';

export class ThrottledCache<T> {
  private cached: T | undefined;
  private hasValue: boolean = false;
  private readonly minIntervalMillis: number;
  private lastAttemptMillis: number | undefined;
  private readonly operation: () => Promise<T>;
  private readonly clock: Clock;
  private inProgress: boolean = false;

  constructor(clock: Clock, minIntervalMillis: number, operation: () => Promise<T>) {
    this.clock = clock;
    this.minIntervalMillis = minIntervalMillis;
    this.operation = operation;
  }

  public get(): T | undefined {
    const now = this.clock.now();
    const isStale = this.lastAttemptMillis === undefined || now - this.lastAttemptMillis >= this.minIntervalMillis;
    if (isStale && !this.inProgress) {
      this.lastAttemptMillis = now;
      this.inProgress = true;
      this.operation()
        .then((result) => {
          this.cached = result;
          this.hasValue = true;
        })
        .catch((err) => console.error('ThrottledCache:get', err))
        .finally(() => this.inProgress = false);
    }
    return this.hasValue ? this.cached : undefined;
  }
}
