import {expect} from 'chai';
import {BonusCardName} from '@/common/automa/BonusCardName';
import {ShippingLines} from '@/server/automa/bonusCards/ShippingLines';
import {recordingMarsBot} from '../corps/RecordingMarsBot';

describe('ShippingLines', () => {
  it('trades with a colony', () => {
    const traded: Array<BonusCardName> = [];
    const {marsBot} = recordingMarsBot({maybeTrade: (bonusCardName) => traded.push(bonusCardName)});

    expect(new ShippingLines().resolve(marsBot)).is.false;
    expect(traded).deep.eq([BonusCardName.SHIPPING_LINES]);
  });
});
