import {expect} from 'chai';
import {Tag} from '@/common/cards/Tag';
import {ASTRODRILL_MARSBOT_CORP} from '@/server/automa/corps/promo/AstrodrillMarsBot';
import {setAllTracks, setTrack} from '../../FakeMarsBot';
import {recordingMarsBot, trackCubes} from '../RecordingMarsBot';

// Track indexes on the Tharsis board
const SPACE = 1;
const PLANT = 6;

describe('AstrodrillMarsBot', () => {
  for (const run of [
    {cube: 'white', calls: [`advanceTrack(${PLANT})`]},
    {cube: 'black', calls: [`advanceTrack(${SPACE})`]},
  ] as const) {
    it(`advances its least advanced track for a white cube and the space track for a black one, ${run.cube} cube`, () => {
      const {marsBot, calls} = recordingMarsBot();
      setAllTracks(marsBot, 2);
      setTrack(marsBot, Tag.PLANT, 1);

      ASTRODRILL_MARSBOT_CORP.effect!.onTrackCubeTrigger!(marsBot, SPACE, 2, run.cube);

      expect(calls).deep.eq(run.calls);
    });
  }

  it('puts its cubes on the space track', () => {
    expect(trackCubes(ASTRODRILL_MARSBOT_CORP)).to.have.members([
      ...[2, 4, 7, 10, 13].map((position) => `space white ${position}`),
      ...[5, 11, 16].map((position) => `space black ${position}`),
    ]);
  });
});
