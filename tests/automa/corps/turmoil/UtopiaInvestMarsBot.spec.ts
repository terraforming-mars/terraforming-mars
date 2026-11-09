import {expect} from 'chai';
import {UTOPIA_INVEST_MARSBOT_CORP} from '@/server/automa/corps/turmoil/UtopiaInvestMarsBot';
import {recordingMarsBot} from '../RecordingMarsBot';

describe('UtopiaInvestMarsBot', () => {
  it('adds Investors to the action deck before the action phase', () => {
    const {marsBot, calls} = recordingMarsBot();

    UTOPIA_INVEST_MARSBOT_CORP.beforeActionPhase!(marsBot);

    expect(calls).deep.eq(['addBonusCardToActionDeck(B32)']);
  });
});
