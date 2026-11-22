import {expect} from 'chai';
import {BonusCardName} from '@/common/automa/BonusCardName';
import {ShippingLinesMarsBot} from '@/server/automa/bonusCards/ShippingLinesMarsBot';
import {recordingMarsBot} from '../corps/RecordingMarsBot';

describe('ShippingLinesMarsBot', () => {
  it('trades with a colony', () => {
    const traded: Array<BonusCardName> = [];
    const {marsBot} = recordingMarsBot({maybeTrade: (bonusCardName) => traded.push(bonusCardName)});

    expect(new ShippingLinesMarsBot().resolve(marsBot)).is.false;
    expect(traded).deep.eq([BonusCardName.SHIPPING_LINES]);
  });
});
