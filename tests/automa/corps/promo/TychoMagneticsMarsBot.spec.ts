import {expect} from 'chai';
import {TYCHO_MAGNETICS_MARSBOT_CORP} from '@/server/automa/corps/promo/TychoMagneticsMarsBot';
import {recordingMarsBot} from '../RecordingMarsBot';

describe('TychoMagneticsMarsBot', () => {
  it('puts Interface Hyperlink at the bottom of the bonus deck at setup', () => {
    const {marsBot, calls} = recordingMarsBot();

    TYCHO_MAGNETICS_MARSBOT_CORP.setup!(marsBot);

    expect(calls).deep.eq(['addBonusCardToBottomOfBonusDeck(B30)']);
  });
});
