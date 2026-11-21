import {expect} from 'chai';
import {Tag} from '@/common/cards/Tag';
import {PointLunaMarsBot} from '@/server/automa/corps/prelude/PointLunaMarsBot';
import {setAllTracks, setTrack} from '../../FakeMarsBot';
import {TRACK, recordingMarsBot, trackCubes} from '../RecordingMarsBot';

describe('PointLunaMarsBot', () => {
  for (const run of [
    {cube: 'white', expected: [`advanceTrack(${TRACK.plant})`]},
    {cube: 'black', expected: [`advanceTrack(${TRACK.space})`]},
  ] as const) {
    it(`advances its least advanced track for a white cube and the space track for a black one, ${run.cube} cube`, () => {
      const {marsBot, calls} = recordingMarsBot();
      setAllTracks(marsBot, 2);
      setTrack(marsBot, Tag.PLANT, 1);

      new PointLunaMarsBot().onTrackCubeTrigger(marsBot, TRACK.earth, 1, run.cube);

      expect(calls).deep.eq(run.expected);
    });
  }

  it('puts its cubes on the Earth track', () => {
    expect(trackCubes(new PointLunaMarsBot())).to.have.members([
      ...[1, 5, 9, 13, 17].map((position) => `earth white ${position}`),
      ...[3, 7, 11, 15].map((position) => `earth black ${position}`),
    ]);
  });
});
