import {expect} from 'chai';
import {ThorgateMarsBot} from '@/server/automa/corps/base/ThorgateMarsBot';
import {TRACK, recordingMarsBot, trackCubes} from '../RecordingMarsBot';

describe('ThorgateMarsBot', () => {
  // The Setup box (rulebook B p.1)
  it('gains 10 M€ at setup', () => {
    const {marsBot, calls} = recordingMarsBot();

    new ThorgateMarsBot().setup(marsBot);

    expect(calls).deep.eq(['gainMc(10)']);
  });

  it('resolves the first tag of a project card and raises the temperature for the white cubes on spaces 4, 6, 8 and 10 of the power track', () => {
    const {marsBot, calls} = recordingMarsBot();

    new ThorgateMarsBot().onTrackCubeTrigger(marsBot, TRACK.power, 1, 'white');

    const expectedCubes = [4, 6, 8, 10].map((position) => `power white ${position}`);
    expect(calls).deep.eq(['maybeDrawAndResolveProjectCardFirstTagOnly()', 'raiseTemperature(1)']);
    expect(trackCubes(new ThorgateMarsBot())).deep.eq(expectedCubes);
  });
});
