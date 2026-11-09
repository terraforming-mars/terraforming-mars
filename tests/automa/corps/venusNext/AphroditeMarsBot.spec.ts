import {expect} from 'chai';
import {APHRODITE_MARSBOT_CORP} from '@/server/automa/corps/venusNext/AphroditeMarsBot';
import {recordingMarsBot} from '../RecordingMarsBot';

describe('AphroditeMarsBot', () => {
  it('gains 2 M€ for each step Venus is raised', () => {
    const {marsBot, calls} = recordingMarsBot();

    APHRODITE_MARSBOT_CORP.effect!.onVenusRaised!(marsBot, 3);

    expect(calls).deep.eq(['gainMc(6)']);
  });
});
