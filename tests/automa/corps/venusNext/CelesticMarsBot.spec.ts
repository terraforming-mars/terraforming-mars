import {expect} from 'chai';
import {CelesticMarsBot} from '@/server/automa/corps/venusNext/CelesticMarsBot';
import {recordingMarsBot} from '../RecordingMarsBot';

describe('CelesticMarsBot', () => {
  // The Setup and Round Start boxes (rulebook B p.1, p.3) and the ongoing effect
  it('adds a floater at setup, at each round start and for each Failed Action', () => {
    const {marsBot, calls} = recordingMarsBot();

    new CelesticMarsBot().setup(marsBot);
    new CelesticMarsBot().roundStart(marsBot);
    new CelesticMarsBot().onFailedAction(marsBot);

    expect(calls).deep.eq(['addFloaters(1)', 'addFloaters(1)', 'addFloaters(1)']);
  });
});
