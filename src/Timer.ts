import {ISerializable} from './ISerializable';
import {SerializedTimer} from './SerializedTimer';

export class Timer implements ISerializable<SerializedTimer> {
  public sumElapsed: number = 0;
  public startedAt: number = 0;
  public running: boolean = false;
  public afterFirstAction: boolean = false;

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
    };
  }

  public static deserialize(d: SerializedTimer): Timer {
    const timer = new Timer();
    Object.assign(timer, d);
    return timer;
  }

  public start() {
    this.running = true;
    this.startedAt = Date.now();
  }

  public stop() {
    this.running = false;
    if (!this.afterFirstAction) {
      this.afterFirstAction = true;
      return; // skipping timer for first move in game
    }
    this.sumElapsed += Date.now() - this.startedAt;
  }

  public static toString(d: SerializedTimer) {
    const elapsed = d.sumElapsed + (d.running ? Date.now() - d.startedAt : 0);
    return new Date(elapsed).toISOString().substr(11, 8);
  }
}

