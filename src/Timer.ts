import {ISerializable} from './ISerializable';
import {SerializedTimer} from './SerializedTimer';

export class Timer implements ISerializable<SerializedTimer> {
  public sumElapsed: number = 0;
  public startedAt: number = 0;
  public running: number = 0;
  public visible: boolean = false;
  public afterFirstAction: boolean = false;

  private constructor() { }

  public static newInstance(): Timer {
    const timer = new Timer();
    return timer;
  }

  public serialize(): SerializedTimer {
    return {
      sumElapsed: this.sumElapsed,
      startedAt: this.startedAt,
      running: this.running,
      visible: this.visible,
      afterFirstAction: this.afterFirstAction,
    };
  }

  public static deserialize(d: SerializedTimer): Timer {
    const timer = new Timer();
    Object.assign(timer, d);
    return timer;
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
}

