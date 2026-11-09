import {expect} from 'chai';
import {PHOBOLOG_MARSBOT_CORP} from '@/server/automa/corps/base/PhoboLogMarsBot';
import {recordingMarsBot, trackCubes} from '../RecordingMarsBot';

// Track index on the Tharsis board
const SPACE = 1;

describe('PhoboLogMarsBot', () => {
  // The Setup box (rulebook B p.1)
  it('adds 2 space cards to the bonus deck at setup', () => {
    const {marsBot, calls} = recordingMarsBot();

    PHOBOLOG_MARSBOT_CORP.setup!(marsBot);

    expect(calls).deep.eq(['addProjectCardsToBonusDeck(space, 2)']);
  });

  it('draws a bonus card for the white cubes on spaces 7, 10, 13 and 15 of the space track', () => {
    const {marsBot, calls} = recordingMarsBot();

    PHOBOLOG_MARSBOT_CORP.effect!.onTrackCubeTrigger!(marsBot, SPACE, 1, 'white');

    expect(calls).deep.eq(['maybeDrawAndResolveBonusCard()']);
    expect(trackCubes(PHOBOLOG_MARSBOT_CORP)).deep.eq([7, 10, 13, 15].map((position) => `space white ${position}`));
  });
});
