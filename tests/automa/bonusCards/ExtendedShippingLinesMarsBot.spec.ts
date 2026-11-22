import {expect} from 'chai';
import {BonusCardName} from '@/common/automa/BonusCardName';
import {ExtendedShippingLinesMarsBot} from '@/server/automa/bonusCards/ExtendedShippingLinesMarsBot';
import {recordingMarsBot} from '../corps/RecordingMarsBot';

describe('ExtendedShippingLinesMarsBot', () => {
  it('trades with a colony', () => {
    const traded: Array<BonusCardName> = [];
    const {marsBot} = recordingMarsBot({maybeTrade: (bonusCardName) => traded.push(bonusCardName)});

    expect(new ExtendedShippingLinesMarsBot().resolve(marsBot)).is.false;
    expect(traded).deep.eq([BonusCardName.EXTENDED_SHIPPING_LINES]);
  });
});
