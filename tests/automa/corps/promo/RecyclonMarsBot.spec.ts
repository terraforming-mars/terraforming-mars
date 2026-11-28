import {expect} from 'chai';
import {Tag} from '@/common/cards/Tag';
import {RecyclonMarsBot} from '@/server/automa/corps/promo/RecyclonMarsBot';
import {recordingMarsBot, trackCubes} from '../RecordingMarsBot';

describe('RecyclonMarsBot', () => {
  // The cubes on the building track (rulebook B p.3)
  it('advances the plant track for the white cubes on spaces 3, 6, 9, 12, 15 and 18 of the building track', () => {
    const {marsBot, calls} = recordingMarsBot();

    new RecyclonMarsBot().onTrackCubeTrigger(marsBot, 0, 3, 'white');

    const expectedCubes = [3, 6, 9, 12, 15, 18].map((position) => `building white ${position}`);
    expect(trackCubes(new RecyclonMarsBot())).deep.eq(expectedCubes);
    expect(calls).deep.eq([`advanceTrack(${marsBot.marsBotBoard.tagToTrack[Tag.PLANT]})`]);
  });
});
