import {Clock} from '../src/Timer';

export class FakeClock extends Clock {
  public millis: number = 0;

  public now(): number {
    return this.millis;
  }
}
