import {SerializedTimer} from './SerializedTimer';
import {TimerModel} from './models/TimerModel';

/**
 * A clock that keeps real time. Can be overridden to provide fake times for testing.
 */
export class Clock {
  /** Current time, as milliseconds in standard time. */
  public now(): number {
    return Date.now();
  }
}
const REAL_CLOCK = new Clock();

/**
 * A game timer for a single player's actions.
 */
export class Timer {
  /**
   *  Sum of elapsed closed time intervals, in milliseconds.
   */
  private sumElapsed: number = 0;
  /**
   * The current interval's start time, as milliseconds in standard time.
   *
   * Meaningless if `running` is false.
   */
  private startedAt: number = 0;
  /**
   * When true, the timer is already running; it started at `startedAt`.
   */
  private running: boolean = false;

  /**
   * When false, this timer ignores `start`.
   */
  private enabled: boolean = false;

  private constructor(private clock: Clock) { }

  public static newInstance(clock: Clock = REAL_CLOCK): Timer {
    return new Timer(clock);
  }

  public serialize(): SerializedTimer {
    return {
      sumElapsed: this.sumElapsed,
      startedAt: this.startedAt,
      running: this.running,
      enabled: this.enabled,
    };
  }

  public toModel(): TimerModel {
    return {
      sumElapsed: this.sumElapsed,
      startedAt: this.startedAt,
      running: this.running,
    };
  }

  public static deserialize(d: SerializedTimer): Timer {
    const timer = new Timer(REAL_CLOCK);
    timer.sumElapsed = d.sumElapsed;
    timer.startedAt = d.startedAt;
    timer.running = d.running;
    timer.enabled = d.enabled ?? d.afterFirstAction ?? false;
    return timer;
  }

  /**
   * Enables this timer. Until then, calls to `start` are ignored.
   */
  public enable(): void {
    this.enabled = true;
  }

  /**
   * Starts this timer at `from`, or now if `from` is undefined, if it is enabled.
   *
   * Called when the game starts waiting for a player's required input.
   */
  public start(from: number | undefined) : void {
    if (!this.enabled) {
      return;
    }
    this.running = true;
    this.startedAt = from ?? this.clock.now();
  }

  /**
   * Stops this timer, and returns the time it stopped.
   *
   * Adds the interval from `startedAt` to now, if this timer is running.
   *
   * Called when a player's required input is answered or cleared.
   */
  public stop() : number {
    const now = this.clock.now();
    if (this.running) {
      this.running = false;
      this.sumElapsed += now - this.startedAt;
    }
    return now;
  }

  /**
   * Refund `millis` time off this timer's elapsed time, but never less than 0 elapsed time.
   */
  rebate(millis: number) {
    this.sumElapsed = Math.max(this.sumElapsed - millis, 0);
  }

  /**
   * Returns the total elapsed time for this timer, in milliseconds. If this timer is currently running,
   * it includes the elapsed time of this interval.
   */
  public getElapsed(): number {
    return this.sumElapsed + (this.running ? this.clock.now() - this.startedAt : 0);
  }

  /**
   * Returns the total elapsed time for this timer, in minutes.
   * @see getElapsed
   */
  public getElapsedTimeInMinutes(): number {
    const elapsedTimeInMin = this.getElapsed() / (60 * 1000);
    return elapsedTimeInMin;
  }

  /**
   * Converts a model of this timer to [hhh:]mm:ss format based on current time.
   *
   * Used to display the timer.
   */
  public static toString(d: TimerModel, clock: Clock = REAL_CLOCK) : string {
    const elapsedMs = d.sumElapsed + (d.running ? clock.now() - d.startedAt : 0);
    const hours = Math.floor(elapsedMs / 3_600_000);
    const asString = new Date(elapsedMs).toISOString();
    if (hours > 0) {
      return String(hours) + asString.slice(13, 19);
    }
    return asString.slice(14, 19);
  }
}
