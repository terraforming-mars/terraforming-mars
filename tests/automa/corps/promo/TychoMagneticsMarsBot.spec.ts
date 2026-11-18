import {expect} from 'chai';
import {TychoMagneticsMarsBot} from '@/server/automa/corps/promo/TychoMagneticsMarsBot';
import {recordingMarsBot} from '../RecordingMarsBot';

describe('TychoMagneticsMarsBot', () => {
  it('puts Interface Hyperlink at the bottom of the bonus deck at setup', () => {
    const {marsBot, calls} = recordingMarsBot();

    new TychoMagneticsMarsBot().setup(marsBot);

    expect(calls).deep.eq(['addBonusCardToBottomOfBonusDeck(B30)']);
  });
});
