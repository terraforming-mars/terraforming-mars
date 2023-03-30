import {expect} from 'chai';
import {TestPlayer} from './TestPlayer';
import {Timer} from '../src/common/Timer';
import {FakeClock} from './common/FakeClock';
import {testGame} from './TestGame';

let player: TestPlayer;
let clock: FakeClock;
let timer: Timer;

describe('EscapeVelocity', function() {
  beforeEach(() => {
    [, player] = testGame(1, {
      escapeVelocityMode: true,
      escapeVelocityThreshold: 3, // 3m
      escapeVelocityPenalty: 2, // 2vp
      escapeVelocityPeriod: 4, // 4m
    });
    (Timer as any).lastStoppedAt = 0;
    clock = new FakeClock();
    timer = Timer.newInstance(clock);
    player.timer = timer;

    // Trigger a vestigial start/stop pair to actually start/stop.
    timer.start();
    timer.stop();
  });

  it('sanity test', function() {
    timer.start();

    expect(player.getVictoryPoints().total).eq(14);

    clock.millis = 3 * 60 * 1000;

    expect(player.getVictoryPoints().total).eq(14);

    clock.millis += 4 * 60 * 1000; // Add 4 minutes, should trigger 2 point loss
    clock.millis--; // But remove 1ms first.

    expect(player.getVictoryPoints().total).eq(14);
    expect(player.getVictoryPoints().escapeVelocity).eq(0);

    clock.millis++;

    expect(player.getVictoryPoints().total).eq(12);
    expect(player.getVictoryPoints().escapeVelocity).eq(-2);
  });

  it('too many points', function() {
    timer.start();

    expect(player.getVictoryPoints().total).eq(14);

    clock.millis = 3 * 60 * 1000;

    expect(player.getVictoryPoints().total).eq(14);

    clock.millis += 4 * 60 * 1000; // Add 4 minutes, should trigger 2 point loss
    expect(player.getVictoryPoints().total).eq(12);

    clock.millis += 4 * 60 * 1000;
    expect(player.getVictoryPoints().total).eq(10);

    clock.millis += 4 * 60 * 1000;
    expect(player.getVictoryPoints().total).eq(8);

    clock.millis += 4 * 60 * 1000;
    expect(player.getVictoryPoints().total).eq(6);

    clock.millis += 4 * 60 * 1000;
    expect(player.getVictoryPoints().total).eq(4);

    clock.millis += 4 * 60 * 1000;
    expect(player.getVictoryPoints().total).eq(2);
    expect(player.getVictoryPoints().escapeVelocity).eq(-12);

    clock.millis += 4 * 60 * 1000;
    expect(player.getVictoryPoints().total).eq(0);
    expect(player.getVictoryPoints().escapeVelocity).eq(-14);

    clock.millis += 4 * 60 * 1000;
    expect(player.getVictoryPoints().total).eq(0);
    expect(player.getVictoryPoints().escapeVelocity).eq(-14);

    player.setTerraformRating(17);

    expect(player.getVictoryPoints().total).eq(1);
    expect(player.getVictoryPoints().escapeVelocity).eq(-16);
  });
});
