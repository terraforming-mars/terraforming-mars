import {expect} from 'chai';
import {Tag} from '@/common/cards/Tag';
import {AstrodrillMarsBot} from '@/server/automa/corps/promo/AstrodrillMarsBot';
import {setAllTracks, setTrack} from '../../FakeMarsBot';
import {TRACK, recordingMarsBot, trackCubes} from '../RecordingMarsBot';

describe('AstrodrillMarsBot', () => {
  for (const run of [
    {cube: 'white', calls: [`advanceTrack(${TRACK.plant})`]},
    {cube: 'black', calls: [`advanceTrack(${TRACK.space})`]},
  ] as const) {
    it(`advances its least advanced track for a white cube and the space track for a black one, ${run.cube} cube`, () => {
      const {marsBot, calls} = recordingMarsBot();
      setAllTracks(marsBot, 2);
      setTrack(marsBot, Tag.PLANT, 1);

      new AstrodrillMarsBot().onTrackCubeTrigger(marsBot, TRACK.space, 2, run.cube);

      expect(calls).deep.eq(run.calls);
    });
  }

  it('puts its cubes on the space track', () => {
    expect(trackCubes(new AstrodrillMarsBot())).to.have.members([
      ...[2, 4, 7, 10, 13].map((position) => `space white ${position}`),
      ...[5, 11, 16].map((position) => `space black ${position}`),
    ]);
  });
});
