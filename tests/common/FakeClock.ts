import {Clock} from '../../src/common/Timer';

export class FakeClock extends Clock {
  public millis = 0;

  public override now(): number {
    return this.millis;
  }
}
