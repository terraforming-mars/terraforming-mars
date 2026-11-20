import {expect} from 'chai';
import {SaturnSystemsMarsBot} from '@/server/automa/corps/base/SaturnSystemsMarsBot';
import {Asteroid} from '@/server/cards/base/Asteroid';
import {AsteroidMining} from '@/server/cards/base/AsteroidMining';
import {TRACK, recordingMarsBot} from '../RecordingMarsBot';

describe('SaturnSystemsMarsBot', () => {
  // A Jovian card of either side (rulebook B p.4)
  for (const run of [
    {card: new AsteroidMining(), tag: 'Jovian', expected: [`advanceTrack(${TRACK.event})`]},
    {card: new Asteroid(), tag: 'space', expected: []},
  ]) {
    it(`advances the event track for a Jovian card MarsBot resolves, ${run.tag} card`, () => {
      const {marsBot, calls} = recordingMarsBot();

      new SaturnSystemsMarsBot().onProjectCardResolved(marsBot, run.card);

      expect(calls).deep.eq(run.expected);
    });

    it(`advances the event track for a Jovian card the player plays, ${run.tag} card`, () => {
      const {marsBot, calls} = recordingMarsBot();

      new SaturnSystemsMarsBot().onHumanCardPlayed(marsBot, run.card);

      expect(calls).deep.eq(run.expected);
    });
  }
});
