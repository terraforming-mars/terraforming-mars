export class Timer {
  public sum_elapsed: number;
  public started_at: number;
  public running: number;
  public visible: boolean;
  public after_first_action: boolean;

  constructor(
    sum_elapsed = 0,
    started_at = new Date().getTime(),
    running = 0,
    visible = false,
    after_first_action = false) {
    this.sum_elapsed = sum_elapsed;
    this.started_at = started_at;
    this.running = running;
    this.visible = visible;
    this.after_first_action = after_first_action;
  }

  public start() {
    if (this.running === 0) {
      this.started_at = new Date().getTime();
    }
    this.running++;
  }

  public stop() {
    if (!this.after_first_action) {
      this.started_at = new Date().getTime();
      this.after_first_action = true;
      return; // skipping timer for first move in game
    }
    this.running--;
    if (this.running === 0) {
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
    return new Timer(d.sum_elapsed, d.started_at, d.running, d.visible, d.after_first_action);
  }
}

