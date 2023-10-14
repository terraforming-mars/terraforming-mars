import {expect} from 'chai';
import {Timer} from '../../src/common/Timer';
import {FakeClock} from './FakeClock';

describe('Timer', () => {
  let clock: FakeClock;
  let timer: Timer;

  beforeEach(() => {
    clock = new FakeClock();
    timer = Timer.newInstance(clock);
    // this lastStoppedAt is a bit of a gross mess.
    (Timer as any).lastStoppedAt = 0;
  });

  it('starts at 00:00', function() {
    expect(Timer.toString(timer.serialize())).eq('00:00');
  });

  it('changes running with start and stop', function() {
    expect(timer.serialize().running).eq(false);
    timer.start();
    expect(timer.serialize().running).eq(true);
    timer.stop();
    expect(timer.serialize().running).eq(false);
    timer.start();
    expect(timer.serialize().running).eq(true);
  });

  it('shows 00:01 after 1 sec', function() {
    timer.start(); // Skipping first action.
    timer.stop();
    expect(Timer.toString(timer.serialize(), clock)).eq('00:00');

    timer.start();
    expect(Timer.toString(timer.serialize(), clock)).eq('00:00');
    clock.millis += 1000;
    expect(Timer.toString(timer.serialize(), clock)).eq('00:01');
    timer.stop();
    expect(Timer.toString(timer.serialize(), clock)).eq('00:01');
  });

  it('shows 1:00:01 after 3601 sec', function() {
    timer.start(); // Skipping first action
    timer.stop();

    timer.start();
    clock.millis += 3601 * 1000;
    expect(Timer.toString(timer.serialize(), clock)).eq('1:00:01');
    timer.stop();
    expect(Timer.toString(timer.serialize(), clock)).eq('1:00:01');
  });

  it('rebate', () => {
    timer.start(); // Skipping first action
    timer.stop();

    timer.start();
    clock.millis += 3601 * 1000;
    timer.stop();
    expect(timer.getElapsed()).eq(3_601_000);
    timer.rebate(7_500);
    expect(timer.getElapsed()).eq(3_593_500);
    timer.rebate(10_000_000); // Doesn't go below zero.
    expect(timer.getElapsed()).eq(0);
  });
});
