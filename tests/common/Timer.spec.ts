import {expect} from 'chai';
import {Timer} from '../../src/common/Timer';
import {FakeClock} from './FakeClock';

describe('Timer', () => {
  let clock: FakeClock;
  let timer: Timer;

  beforeEach(() => {
    clock = new FakeClock();
    timer = Timer.newInstance(clock);
    timer.enable();
  });

  it('starts at 00:00', () => {
    expect(Timer.toString(timer.serialize())).eq('00:00');
  });

  it('changes running with start and stop', () => {
    expect(timer.serialize().running).eq(false);
    timer.start(undefined);
    expect(timer.serialize().running).eq(true);
    timer.stop();
    expect(timer.serialize().running).eq(false);
    timer.start(undefined);
    expect(timer.serialize().running).eq(true);
  });

  it('shows 00:01 after 1 sec', () => {
    timer.start(undefined);
    expect(Timer.toString(timer.serialize(), clock)).eq('00:00');
    clock.millis += 1000;
    expect(Timer.toString(timer.serialize(), clock)).eq('00:01');
    timer.stop();
    expect(Timer.toString(timer.serialize(), clock)).eq('00:01');
  });

  it('does not run until enabled', () => {
    const disabled = Timer.newInstance(clock);
    disabled.start(clock.millis - 24 * 3_600_000);
    expect(disabled.serialize().running).eq(false);
    clock.millis += 1000;
    expect(disabled.getElapsed()).eq(0);
    expect(Timer.toString(disabled.serialize(), clock)).eq('00:00');
    disabled.stop();
    expect(disabled.getElapsed()).eq(0);

    disabled.enable();
    disabled.start(undefined);
    clock.millis += 1000;
    disabled.stop();
    expect(disabled.getElapsed()).eq(1000);
  });

  it('stop on a stopped timer adds nothing', () => {
    timer.start(undefined);
    clock.millis += 1000;
    timer.stop();
    clock.millis += 1000;
    timer.stop();
    expect(timer.getElapsed()).eq(1000);
  });

  it('deserializes legacy afterFirstAction as enabled', () => {
    const legacy = (afterFirstAction: boolean) => Timer.deserialize({
      sumElapsed: 0,
      startedAt: 0,
      running: false,
      afterFirstAction,
    } as any);
    expect(legacy(true).serialize().enabled).eq(true);
    expect(legacy(false).serialize().enabled).eq(false);
  });

  it('shows 1:00:01 after 3601 sec', () => {
    timer.start(undefined);
    clock.millis += 3601 * 1000;
    expect(Timer.toString(timer.serialize(), clock)).eq('1:00:01');
    timer.stop();
    expect(Timer.toString(timer.serialize(), clock)).eq('1:00:01');
  });

  const toString = (sumElapsed: number) => Timer.toString({
    sumElapsed,
    startedAt: 0,
    running: false,
  });

  it('shows 3-digit hours', () => {
    expect(toString(((252 * 60 + 44) * 60 + 11) * 1000)).eq('252:44:11');
  });

  it('does not wrap hours after 31 days', () => {
    expect(toString(743 * 3_600_000)).eq('743:00:00');
    expect(toString(744 * 3_600_000)).eq('744:00:00');
    expect(toString(745 * 3_600_000 + 1000)).eq('745:00:01');
    expect(toString(1234 * 3_600_000)).eq('1234:00:00');
  });

  it('starts at the given time', () => {
    clock.millis = 5000;
    timer.start(1000);
    expect(timer.serialize().startedAt).eq(1000);
    expect(timer.getElapsed()).eq(4000);
  });

  it('stop returns the time it stopped', () => {
    clock.millis = 5000;
    expect(timer.stop()).eq(5000);
    timer.start(undefined);
    clock.millis = 7000;
    expect(timer.stop()).eq(7000);
  });

  it('rebate', () => {
    timer.start(undefined);
    clock.millis += 3601 * 1000;
    timer.stop();
    expect(timer.getElapsed()).eq(3_601_000);
    timer.rebate(7_500);
    expect(timer.getElapsed()).eq(3_593_500);
    timer.rebate(10_000_000); // Doesn't go below zero.
    expect(timer.getElapsed()).eq(0);
  });
});
