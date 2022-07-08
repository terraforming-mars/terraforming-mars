export class Metrics {
  public static INSTANCE: Metrics = new Metrics();

  private metrics: {[key: string]: string | number} = {};
  private startTimeMs: number;

  private constructor() {
    this.startTimeMs = new Date().getTime();
  }

  public add(key: string, value: string | number) {
    this.metrics[key] = value;
  }

  public mark(key: string) {
    const nowMs = new Date().getTime();
    this.add(key, nowMs - this.startTimeMs);
  }

  public time(key: string, cb: () => void) {
    const startMs = new Date().getTime();
    cb();
    const endMs = new Date().getTime();
    this.add(key, endMs - startMs);
  }

  public get() {
    return this.metrics;
  }
}
