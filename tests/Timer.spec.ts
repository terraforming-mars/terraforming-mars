import {expect} from 'chai';
import {Timer} from '../src/Timer';
import {FakeClock} from './FakeClock';

describe('Timer', function() {
  it('starts at 00:00', function() {
    const timer = Timer.newInstance();
    expect(Timer.toString(timer.serialize())).eq('00:00');
  });

  it('changes running with start and stop', function() {
    const timer = Timer.newInstance();
    expect(timer.serialize().running).eq(false);
    timer.start();
    expect(timer.serialize().running).eq(true);
    timer.stop();
    expect(timer.serialize().running).eq(false);
    timer.start();
    expect(timer.serialize().running).eq(true);
  });

  it('shows 00:01 after 1 sec', function() {
    // this lastStoppedAt is a bit of a gross mess.
    (Timer as any).lastStoppedAt = 0;
    const clock = new FakeClock();
    const timer = Timer.newInstance(clock);

    // The first action in the game is not timed (??? why ???)
    // So run a start/stop pair.
    timer.start();
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
    // this lastStoppedAt is a bit of a gross mess.
    (Timer as any).lastStoppedAt = 0;
    const clock = new FakeClock();
    const timer = Timer.newInstance(clock);

    timer.start(); // Skipping first action
    timer.stop();

    timer.start();
    clock.millis += 3601 * 1000;
    expect(Timer.toString(timer.serialize(), clock)).eq('1:00:01');
    timer.stop();
    expect(Timer.toString(timer.serialize(), clock)).eq('1:00:01');
  });
});
