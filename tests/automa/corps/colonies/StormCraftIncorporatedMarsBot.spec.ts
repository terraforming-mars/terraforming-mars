import {expect} from 'chai';
import {StormCraftIncorporatedMarsBot} from '@/server/automa/corps/colonies/StormCraftIncorporatedMarsBot';
import {recordingMarsBot} from '../RecordingMarsBot';

describe('StormCraftIncorporatedMarsBot', () => {
  // The Setup and Round Start boxes (rulebook B p.1, p.3) and the ongoing effect
  it('adds a floater at setup and at each round start, and raises the temperature when floaters pay for an extra card', () => {
    const {marsBot, calls} = recordingMarsBot();

    new StormCraftIncorporatedMarsBot().setup(marsBot);
    new StormCraftIncorporatedMarsBot().roundStart(marsBot);
    new StormCraftIncorporatedMarsBot().onFloatersSpentForExtraCard(marsBot);

    expect(calls).deep.eq(['addFloaters(1)', 'addFloaters(1)', 'raiseTemperature(1)']);
  });
});
