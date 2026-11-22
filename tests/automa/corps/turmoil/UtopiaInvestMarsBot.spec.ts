import {expect} from 'chai';
import {UtopiaInvestMarsBot} from '@/server/automa/corps/turmoil/UtopiaInvestMarsBot';
import {recordingMarsBot} from '../RecordingMarsBot';

describe('UtopiaInvestMarsBot', () => {
  it('adds Investors to the action deck before the action phase', () => {
    const {marsBot, calls} = recordingMarsBot();

    new UtopiaInvestMarsBot().beforeActionPhase(marsBot);

    expect(calls).deep.eq(['addBonusCardToActionDeck(Investors)']);
  });
});
