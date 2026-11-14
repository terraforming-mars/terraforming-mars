import {expect} from 'chai';
import {STORMCRAFT_INCORPORATED_MARSBOT_CORP} from '@/server/automa/corps/colonies/StormCraftIncorporatedMarsBot';
import {recordingMarsBot} from '../RecordingMarsBot';

describe('StormCraftIncorporatedMarsBot', () => {
  // The Setup and Round Start boxes (rulebook B p.1, p.3), then the effect
  it('adds a floater at setup and at each round start, and raises the temperature when floaters pay for an extra card', () => {
    const {marsBot, calls} = recordingMarsBot();

    STORMCRAFT_INCORPORATED_MARSBOT_CORP.setup!(marsBot);
    STORMCRAFT_INCORPORATED_MARSBOT_CORP.roundStart!(marsBot);
    STORMCRAFT_INCORPORATED_MARSBOT_CORP.effect!.onFloatersSpentForExtraCard!(marsBot);

    expect(calls).deep.eq(['addFloaters(1)', 'addFloaters(1)', 'raiseTemperature(1)']);
  });
});
