import {expect} from 'chai';
import {SATURN_SYSTEMS_MARSBOT_CORP} from '@/server/automa/corps/base/SaturnSystemsMarsBot';
import {Asteroid} from '@/server/cards/base/Asteroid';
import {AsteroidMining} from '@/server/cards/base/AsteroidMining';
import {recordingMarsBot} from '../RecordingMarsBot';

// Track index on the Tharsis board
const EVENT = 2;

describe('SaturnSystemsMarsBot', () => {
  // A Jovian card of either side (rulebook B p.4)
  for (const run of [
    {card: new AsteroidMining(), tag: 'Jovian', calls: [`advanceTrack(${EVENT})`]},
    {card: new Asteroid(), tag: 'space', calls: []},
  ]) {
    it(`advances the event track for a Jovian card MarsBot resolves, ${run.tag} card`, () => {
      const {marsBot, calls} = recordingMarsBot();

      SATURN_SYSTEMS_MARSBOT_CORP.effect!.onProjectCardResolved!(marsBot, run.card);

      expect(calls).deep.eq(run.calls);
    });

    it(`advances the event track for a Jovian card the player plays, ${run.tag} card`, () => {
      const {marsBot, calls} = recordingMarsBot();

      SATURN_SYSTEMS_MARSBOT_CORP.effect!.onHumanCardPlayed!(marsBot, run.card);

      expect(calls).deep.eq(run.calls);
    });
  }
});
