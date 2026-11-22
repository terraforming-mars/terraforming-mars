import {expect} from 'chai';
import {CheungShingMARSMarsBot} from '@/server/automa/corps/prelude/CheungShingMARSMarsBot';
import {TRACK, recordingMarsBot, trackCubes} from '../RecordingMarsBot';

describe('CheungShingMARSMarsBot', () => {
  it('gains 5 M€ for the silver resource cubes on spaces 4 to 18 of the building track', () => {
    const {marsBot, calls} = recordingMarsBot();

    new CheungShingMARSMarsBot().onTrackCubeTrigger(marsBot, TRACK.building, 4, 'credit');

    const expectedCubes = Array.from({length: 15}, (_, i) => `building credit ${i + 4}`);
    expect(calls).deep.eq(['gainMc(5)']);
    expect(trackCubes(new CheungShingMARSMarsBot())).deep.eq(expectedCubes);
  });
});
