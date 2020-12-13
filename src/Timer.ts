export class Timer {
  public sumElapsed: number;
  public startedAt: number;
  public running: number;
  public visible: boolean;
  public afterFirstAction: boolean;

  constructor(
    sumElapsed = 0,
    startedAt = Date.now(),
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
      this.startedAt = Date.now();
    }
    this.running++;
  }

  public stop() {
    this.running--;
    if (!this.afterFirstAction) {
      this.startedAt = Date.now();
      this.afterFirstAction = true;
      return; // skipping timer for first move in game
    }
    if (this.running === 0) {
      this.sumElapsed += Date.now() - this.startedAt;
    }
  }

  public toString() {
    const elapsed = this.sumElapsed + (this.running ? Date.now() - this.startedAt : 0);
    return new Date(elapsed).toISOString().substr(11, 8);
  }

  static fromJSON(d: Timer) {
    return new Timer(d.sumElapsed, d.startedAt, d.running, d.visible, d.afterFirstAction);
  }
}

