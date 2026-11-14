import {expect} from 'chai';
import {Tag} from '@/common/cards/Tag';
import {RECYCLON_MARSBOT_CORP} from '@/server/automa/corps/promo/RecyclonMarsBot';
import {recordingMarsBot, trackCubes} from '../RecordingMarsBot';

describe('RecyclonMarsBot', () => {
  // C23: the cubes on the building track (rulebook B p.3)
  it('advances the plant track for the white cubes on spaces 3, 6, 9, 12, 15 and 18 of the building track', () => {
    const {marsBot, calls} = recordingMarsBot();

    RECYCLON_MARSBOT_CORP.effect!.onTrackCubeTrigger!(marsBot, 0, 3, 'white');

    expect(trackCubes(RECYCLON_MARSBOT_CORP)).deep.eq([3, 6, 9, 12, 15, 18].map((position) => `building white ${position}`));
    expect(calls).deep.eq([`advanceTrack(${marsBot.marsBotBoard.tagToTrack[Tag.PLANT]})`]);
  });
});
