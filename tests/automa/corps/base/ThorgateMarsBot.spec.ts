import {expect} from 'chai';
import {THORGATE_MARSBOT_CORP} from '@/server/automa/corps/base/ThorgateMarsBot';
import {recordingMarsBot, trackCubes} from '../RecordingMarsBot';

// Track index on the Tharsis board
const POWER = 4;

describe('ThorgateMarsBot', () => {
  // The Setup box (rulebook B p.1)
  it('gains 10 M€ at setup', () => {
    const {marsBot, calls} = recordingMarsBot();

    THORGATE_MARSBOT_CORP.setup!(marsBot);

    expect(calls).deep.eq(['gainMc(10)']);
  });

  it('resolves the first tag of a project card and raises the temperature for the white cubes on spaces 4, 6, 8 and 10 of the power track', () => {
    const {marsBot, calls} = recordingMarsBot();

    THORGATE_MARSBOT_CORP.effect!.onTrackCubeTrigger!(marsBot, POWER, 1, 'white');

    expect(calls).deep.eq(['maybeDrawAndResolveProjectCardFirstTagOnly()', 'raiseTemperature(1)']);
    expect(trackCubes(THORGATE_MARSBOT_CORP)).deep.eq([4, 6, 8, 10].map((position) => `power white ${position}`));
  });
});
