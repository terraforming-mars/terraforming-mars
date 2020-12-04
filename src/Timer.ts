import assert = require('assert');

export class Timer {
  public sum_elapsed: number;
  public started_at: number;
  public running: boolean;

  constructor(sum_elapsed = 0, started_at = new Date().getTime(), running = false) {
    this.sum_elapsed = sum_elapsed;
    this.started_at = started_at;
    this.running = running;
  }

  public start() {
    assert(!this.running);
    this.running = true;
    this.started_at = new Date().getTime();
  }

  public stop() {
    if (this.running) {
      this.running = false;
      this.sum_elapsed += new Date().getTime() - this.started_at;
    }
  }

  public toString() {
    const date: Date = new Date(this.sum_elapsed + (this.running ? new Date().getTime() - this.started_at:0));
    const res = [
      Math.floor(date.getTime() / (1000*60*60)),
      date.getUTCMinutes(),
      date.getUTCSeconds()];

    return res.map((s) => String(s).padStart(2, '0')).join(':');
  }

  static fromJSON(d: Timer) {
    return new Timer(d.sum_elapsed, d.started_at, d.running);
  }
}

