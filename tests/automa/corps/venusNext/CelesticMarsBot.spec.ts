import {expect} from 'chai';
import {CELESTIC_MARSBOT_CORP} from '@/server/automa/corps/venusNext/CelesticMarsBot';
import {recordingMarsBot} from '../RecordingMarsBot';

describe('CelesticMarsBot', () => {
  // The Setup and Round Start boxes (rulebook B p.1, p.3), then the effect
  it('adds a floater at setup, at each round start and for each Failed Action', () => {
    const {marsBot, calls} = recordingMarsBot();

    CELESTIC_MARSBOT_CORP.setup!(marsBot);
    CELESTIC_MARSBOT_CORP.roundStart!(marsBot);
    CELESTIC_MARSBOT_CORP.effect!.onFailedAction!(marsBot);

    expect(calls).deep.eq(['addFloaters(1)', 'addFloaters(1)', 'addFloaters(1)']);
  });
});
