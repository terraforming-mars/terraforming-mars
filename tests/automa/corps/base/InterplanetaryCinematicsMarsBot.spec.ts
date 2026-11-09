import {expect} from 'chai';
import {INTERPLANETARY_CINEMATICS_MARSBOT_CORP} from '@/server/automa/corps/base/InterplanetaryCinematicsMarsBot';
import {recordingMarsBot, trackCubes} from '../RecordingMarsBot';

// Track indexes on the Tharsis board
const BUILDING = 0;
const EVENT = 2;

describe('InterplanetaryCinematicsMarsBot', () => {
  for (const run of [{track: BUILDING, tag: 'building'}, {track: EVENT, tag: 'event'}]) {
    it(`gains 2 M€ for each advance of the building and event tracks, ${run.tag} cube`, () => {
      const {marsBot, calls} = recordingMarsBot();

      INTERPLANETARY_CINEMATICS_MARSBOT_CORP.effect!.onTrackCubeTrigger!(marsBot, run.track, 1, 'white');

      expect(calls).deep.eq(['gainMc(2)']);
    });
  }

  it('puts a white cube on every space of the building and event tracks', () => {
    const all = Array.from({length: 18}, (_, i) => i + 1);

    expect(trackCubes(INTERPLANETARY_CINEMATICS_MARSBOT_CORP))
      .to.have.members(['building', 'event'].flatMap((tag) => all.map((position) => `${tag} white ${position}`)));
    expect(INTERPLANETARY_CINEMATICS_MARSBOT_CORP.trackCubesTriggerEveryAdvance).is.true;
  });
});
