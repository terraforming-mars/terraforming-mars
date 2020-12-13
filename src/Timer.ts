export class Timer {
  public sumElapsed: number;
  public startedAt: number;
  public running: number;
  public visible: boolean;
  public afterFirstAction: boolean;

  constructor(
    sumElapsed = 0,
    startedAt = new Date().getTime(),
    running = 0,
    visible = false,
    afterFirstAction = false) {
    this.sumElapsed = sumElapsed;
    this.startedAt = startedAt;
    this.running = running;
    this.visible = visible;
    this.afterFirstAction = afterFirstAction;
  }

  public start() {
    if (this.running === 0) {
      this.startedAt = new Date().getTime();
    }
    this.running++;
  }

  public stop() {
    this.running--;
    if (!this.afterFirstAction) {
      this.startedAt = new Date().getTime();
      this.afterFirstAction = true;
      return; // skipping timer for first move in game
    }
    if (this.running === 0) {
      this.sumElapsed += new Date().getTime() - this.startedAt;
    }
  }

  public toString() {
    const date: Date = new Date(this.sumElapsed + (this.running ? new Date().getTime() - this.startedAt:0));
    const res = [
      Math.floor(date.getTime() / (1000*60*60)),
      date.getUTCMinutes(),
      date.getUTCSeconds()];

    return res.map((s) => String(s).padStart(2, '0')).join(':');
  }

  static fromJSON(d: Timer) {
    return new Timer(d.sumElapsed, d.startedAt, d.running, d.visible, d.afterFirstAction);
  }
}

