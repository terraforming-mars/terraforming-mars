import {expect} from 'chai';
import {PhoboLogMarsBot} from '@/server/automa/corps/base/PhoboLogMarsBot';
import {TRACK, recordingMarsBot, trackCubes} from '../RecordingMarsBot';

describe('PhoboLogMarsBot', () => {
  // The Setup box (rulebook B p.1)
  it('adds 2 space cards to the bonus deck at setup', () => {
    const {marsBot, calls} = recordingMarsBot();

    new PhoboLogMarsBot().setup(marsBot);

    expect(calls).deep.eq(['addProjectCardsToBonusDeck(space, 2)']);
  });

  it('draws a bonus card for the white cubes on spaces 7, 10, 13 and 15 of the space track', () => {
    const {marsBot, calls} = recordingMarsBot();

    new PhoboLogMarsBot().onTrackCubeTrigger(marsBot, TRACK.space, 1, 'white');

    const expectedCubes = [7, 10, 13, 15].map((position) => `space white ${position}`);
    expect(calls).deep.eq(['maybeDrawAndResolveBonusCard()']);
    expect(trackCubes(new PhoboLogMarsBot())).deep.eq(expectedCubes);
  });
});
