import {ISerializable} from './ISerializable';
import {SerializedTimer} from './SerializedTimer';

export class Timer implements ISerializable<SerializedTimer> {
  private sumElapsed: number = 0; // Sum of elapsed closed time intervals
  private startedAt: number = 0; // When was current time interval started
  private running: boolean = false; // Is the timer currently running
  private afterFirstAction: boolean = false; // Are we already after first action (First action time measure is currently skipped.)
  private static lastStoppedAt: number = 0; // When was last time any Timer.stop() called

  private constructor() { }

  public static newInstance(): Timer {
    return new Timer();
  }

  public serialize(): SerializedTimer {
    return {
      sumElapsed: this.sumElapsed,
      startedAt: this.startedAt,
      running: this.running,
      afterFirstAction: this.afterFirstAction,
      lastStoppedAt: Timer.lastStoppedAt,
    };
  }

  public static deserialize(d: SerializedTimer): Timer {
    const timer = new Timer();
    Object.assign(timer, d);
    Timer.lastStoppedAt = d.lastStoppedAt;
    return timer;
  }

  // start() is always called when player can perform new input action.
  public start() {
    this.running = true;
    // Timer is starting when previous timer was stopped. Normally it does not make any difference,
    // but this way undoing actions does not undo the timers.
    this.startedAt = Timer.lastStoppedAt === 0 ? Date.now() : Timer.lastStoppedAt;
  }

  // stop() is called immediately when player performs new input action.
  public stop() {
    this.running = false;
    Timer.lastStoppedAt = Date.now();
    if (!this.afterFirstAction) { // Skipping timer for first move in game
      this.afterFirstAction = true;
      return;
    }
    this.sumElapsed += Timer.lastStoppedAt - this.startedAt;
  }

  public static toString(d: SerializedTimer) {
    const elapsed = d.sumElapsed + (d.running ? Date.now() - d.startedAt : 0);
    return new Date(elapsed).toISOString().substr(11, 8);
  }
}

