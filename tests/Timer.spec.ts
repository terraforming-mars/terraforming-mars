import {expect} from 'chai';
import {Timer} from '../src/Timer';

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
    const timer = Timer.newInstance();
    timer.start(); // Skipping first action
    let callCount = 0;
    const originalNow = Date.now;
    const start = originalNow();
    Date.now = function() {
      callCount++;
      if (callCount === 1) {
        return start;
      }
      return start + 1000;
    };
    timer.stop();
    timer.start();
    expect(Timer.toString(timer.serialize())).eq('00:01');
    timer.stop();
    expect(Timer.toString(timer.serialize())).eq('00:01');
    Date.now = originalNow;
  });

  it('shows 1:00:01 after 3601 sec', function() {
    const timer = Timer.newInstance();
    timer.start(); // Skipping first action
    let callCount = 0;
    const originalNow = Date.now;
    const start = originalNow();
    Date.now = function() {
      callCount++;
      if (callCount === 1) {
        return start;
      }
      return start + 3601000;
    };
    timer.stop();
    timer.start();
    expect(Timer.toString(timer.serialize())).eq('1:00:01');
    timer.stop();
    expect(Timer.toString(timer.serialize())).eq('1:00:01');
    Date.now = originalNow;
  });
});
