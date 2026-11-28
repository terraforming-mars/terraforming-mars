import {expect} from 'chai';
import {EcoLineMarsBot} from '@/server/automa/corps/base/EcoLineMarsBot';
import {recordingMarsBot} from '../RecordingMarsBot';

describe('EcoLineMarsBot', () => {
  // The start of a generation (rulebook B p.3)
  it('adds Rapid Sprouting to the action deck before the action phase', () => {
    const {marsBot, calls} = recordingMarsBot();

    new EcoLineMarsBot().beforeActionPhase(marsBot);

    expect(calls).deep.eq(['addBonusCardToActionDeck(Rapid Sprouting)']);
  });
});
