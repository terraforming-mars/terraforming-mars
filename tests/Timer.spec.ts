import {expect} from 'chai';
import {Timer} from '../src/Timer';

describe('Timer', function() {
  it('starts at 00:00:00', function() {
    const timer = Timer.newInstance();
    expect(Timer.toString(timer.serialize())).eq('00:00:00');
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

  it('shows 00:00:01 after 1 sec', function(done) {
    const timer = Timer.newInstance();
    timer.start(); // Skipping first action
    timer.stop();
    timer.start();
    setTimeout(() => {
      expect(Timer.toString(timer.serialize())).eq('00:00:01');
      timer.stop();
      expect(Timer.toString(timer.serialize())).eq('00:00:01');
      done();
    }, 1000);
  });
});
