import {expect} from 'chai';
import {InterplanetaryCinematicsMarsBot} from '@/server/automa/corps/base/InterplanetaryCinematicsMarsBot';
import {TRACK, recordingMarsBot, trackCubes} from '../RecordingMarsBot';

describe('InterplanetaryCinematicsMarsBot', () => {
  for (const run of [{track: TRACK.building, tag: 'building'}, {track: TRACK.event, tag: 'event'}]) {
    it(`gains 2 M€ for each advance of the building and event tracks, ${run.tag} cube`, () => {
      const {marsBot, calls} = recordingMarsBot();

      new InterplanetaryCinematicsMarsBot().onTrackCubeTrigger(marsBot, run.track, 1, 'white');

      expect(calls).deep.eq(['gainMc(2)']);
    });
  }

  it('puts a white cube on every space of the building and event tracks', () => {
    const all = Array.from({length: 18}, (_, i) => i + 1);
    const expected = ['building', 'event'].flatMap((tag) => all.map((position) => `${tag} white ${position}`));

    expect(trackCubes(new InterplanetaryCinematicsMarsBot())).to.have.members(expected);
    expect(new InterplanetaryCinematicsMarsBot().trackCubesTriggerEveryAdvance).is.true;
  });
});
