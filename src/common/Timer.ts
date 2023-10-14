import {SerializedTimer} from './SerializedTimer';

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
   * When was the last time any timer called Timer.stop?
   *
   * Time is in milliseconds.
   *
   * This applies to all games. Doesn't that render this useless?
   * Doesn't the deserialization also render this useless?
   */
  private static lastStoppedAt: number = 0;

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
   * If false, this is the first action of the game. The first action of the game is not timed.
   */
  private afterFirstAction: boolean = false;

  private constructor(private clock: Clock) { }

  public static newInstance(clock: Clock = REAL_CLOCK): Timer {
    return new Timer(clock);
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
    const timer = new Timer(REAL_CLOCK);
    timer.sumElapsed = d.sumElapsed;
    timer.startedAt = d.startedAt;
    timer.running = d.running;
    timer.afterFirstAction = d.afterFirstAction;

    // Should this be `Math.max(Timer.lastStoppedAt, d.lastStoppedAt)`?
    Timer.lastStoppedAt = d.lastStoppedAt;
    return timer;
  }

  /**
   * Starts this timer.
   *
   * This is always called when the game is waiting for a player to supply input.
   */
  public start() : void {
    this.running = true;
    // Timer is starting when previous timer was stopped. Normally it does not make any difference,
    // but this way undoing actions does not undo the timers.
    this.startedAt = Timer.lastStoppedAt === 0 ? this.clock.now() : Timer.lastStoppedAt;
  }

  /**
   * Stops this timer.
   *
   * Records the interval from the last call to `start` to now, and records it.
   *
   * This is always called immediately after player performs a new input action.
   */
  public stop() : void {
    this.running = false;
    Timer.lastStoppedAt = this.clock.now();
    if (!this.afterFirstAction) { // Skipping timer for first move in game
      this.afterFirstAction = true;
      return;
    }
    this.sumElapsed += Timer.lastStoppedAt - this.startedAt;
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
   * Converts a serialized version of this timer to [hhh:]mm:ss format based on current time.
   *
   * Used to display the timer.
   */
  public static toString(d: SerializedTimer, clock: Clock = REAL_CLOCK) : string {
    const elapsed = d.sumElapsed + (d.running ? clock.now() - d.startedAt : 0);
    const elapsedDate = new Date(elapsed);
    const hours = elapsedDate.getUTCHours() + (elapsedDate.getUTCDate() - 1) * 24;
    if (hours > 0) {
      return String(hours) + elapsedDate.toISOString().substr(13, 6);
    }
    return elapsedDate.toISOString().substr(14, 5);
  }
}

