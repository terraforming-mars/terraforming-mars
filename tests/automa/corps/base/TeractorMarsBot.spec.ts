import {expect} from 'chai';
import {TeractorMarsBot} from '@/server/automa/corps/base/TeractorMarsBot';
import {recordingMarsBot, trackCubes} from '../RecordingMarsBot';

// Track index on the Tharsis board
const EARTH = 5;

describe('TeractorMarsBot', () => {
  // The Setup box (rulebook B p.1)
  it('gains 25 M€ at setup', () => {
    const {marsBot, calls} = recordingMarsBot();

    new TeractorMarsBot().setup(marsBot);

    expect(calls).deep.eq(['gainMc(25)']);
  });

  it('gains 2 M€ for each advance of the Earth track, which has a white cube on every space', () => {
    const {marsBot, calls} = recordingMarsBot();

    new TeractorMarsBot().onTrackCubeTrigger(marsBot, EARTH, 1, 'white');

    expect(calls).deep.eq(['gainMc(2)']);
    expect(trackCubes(new TeractorMarsBot())).deep.eq(Array.from({length: 18}, (_, i) => `earth white ${i + 1}`));
    expect(new TeractorMarsBot().trackCubesTriggerEveryAdvance).is.true;
  });
});
