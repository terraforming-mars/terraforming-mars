import {expect} from 'chai';
import {ECOLINE_MARSBOT_CORP} from '@/server/automa/corps/base/EcoLineMarsBot';
import {recordingMarsBot} from '../RecordingMarsBot';

describe('EcoLineMarsBot', () => {
  // The start of a generation (rulebook B p.3)
  it('adds Rapid Sprouting to the action deck before the action phase', () => {
    const {marsBot, calls} = recordingMarsBot();

    ECOLINE_MARSBOT_CORP.beforeActionPhase!(marsBot);

    expect(calls).deep.eq(['addBonusCardToActionDeck(B23)']);
  });
});
