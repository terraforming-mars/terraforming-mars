import {expect} from 'chai';
import {Tag} from '@/common/cards/Tag';
import {POINT_LUNA_MARSBOT_CORP} from '@/server/automa/corps/prelude/PointLunaMarsBot';
import {setAllTracks, setTrack} from '../../FakeMarsBot';
import {recordingMarsBot, trackCubes} from '../RecordingMarsBot';

// Track indexes on the Tharsis board
const SPACE = 1;
const EARTH = 5;
const PLANT = 6;

describe('PointLunaMarsBot', () => {
  for (const run of [
    {cube: 'white', calls: [`advanceTrack(${PLANT})`]},
    {cube: 'black', calls: [`advanceTrack(${SPACE})`]},
  ] as const) {
    it(`advances its least advanced track for a white cube and the space track for a black one, ${run.cube} cube`, () => {
      const {marsBot, calls} = recordingMarsBot();
      setAllTracks(marsBot, 2);
      setTrack(marsBot, Tag.PLANT, 1);

      POINT_LUNA_MARSBOT_CORP.effect!.onTrackCubeTrigger!(marsBot, EARTH, 1, run.cube);

      expect(calls).deep.eq(run.calls);
    });
  }

  it('puts its cubes on the Earth track', () => {
    expect(trackCubes(POINT_LUNA_MARSBOT_CORP)).to.have.members([
      ...[1, 5, 9, 13, 17].map((position) => `earth white ${position}`),
      ...[3, 7, 11, 15].map((position) => `earth black ${position}`),
    ]);
  });
});
