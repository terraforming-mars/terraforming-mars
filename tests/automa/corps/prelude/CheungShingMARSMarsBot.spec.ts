import {expect} from 'chai';
import {CHEUNG_SHING_MARS_MARSBOT_CORP} from '@/server/automa/corps/prelude/CheungShingMARSMarsBot';
import {recordingMarsBot, trackCubes} from '../RecordingMarsBot';

// Track index on the Tharsis board
const BUILDING = 0;

describe('CheungShingMARSMarsBot', () => {
  it('gains 5 M€ for the silver resource cubes on spaces 4 to 18 of the building track', () => {
    const {marsBot, calls} = recordingMarsBot();

    CHEUNG_SHING_MARS_MARSBOT_CORP.effect!.onTrackCubeTrigger!(marsBot, BUILDING, 4, 'credit');

    expect(calls).deep.eq(['gainMc(5)']);
    expect(trackCubes(CHEUNG_SHING_MARS_MARSBOT_CORP)).deep.eq(Array.from({length: 15}, (_, i) => `building credit ${i + 4}`));
  });
});
