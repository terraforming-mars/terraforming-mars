import {expect} from 'chai';
import {VALLEY_TRUST_MARSBOT_CORP} from '@/server/automa/corps/prelude/ValleyTrustMarsBot';
import {recordingMarsBot, trackCubes} from '../RecordingMarsBot';

// Track index on the Tharsis board
const SCIENCE = 3;

describe('ValleyTrustMarsBot', () => {
  it('draws a project card to the action deck at setup', () => {
    const {marsBot, calls} = recordingMarsBot();

    VALLEY_TRUST_MARSBOT_CORP.setup!(marsBot);

    expect(calls).deep.eq(['drawProjectCardsToActionDeck(1)']);
  });

  it('draws and resolves a project card for the white cubes on spaces 8 and 16 of the science track', () => {
    const {marsBot, calls} = recordingMarsBot();

    VALLEY_TRUST_MARSBOT_CORP.effect!.onTrackCubeTrigger!(marsBot, SCIENCE, 8, 'white');

    expect(calls).deep.eq(['maybeDrawAndResolveProjectCard()']);
    expect(trackCubes(VALLEY_TRUST_MARSBOT_CORP)).deep.eq(['science white 8', 'science white 16']);
  });
});
