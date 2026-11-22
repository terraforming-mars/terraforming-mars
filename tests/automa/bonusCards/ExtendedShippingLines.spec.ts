import {expect} from 'chai';
import {BonusCardName} from '@/common/automa/BonusCardName';
import {ExtendedShippingLines} from '@/server/automa/bonusCards/ExtendedShippingLines';
import {recordingMarsBot} from '../corps/RecordingMarsBot';

describe('ExtendedShippingLines', () => {
  it('trades with a colony', () => {
    const traded: Array<BonusCardName> = [];
    const {marsBot} = recordingMarsBot({maybeTrade: (bonusCardName) => traded.push(bonusCardName)});

    expect(new ExtendedShippingLines().resolve(marsBot)).is.false;
    expect(traded).deep.eq([BonusCardName.EXTENDED_SHIPPING_LINES]);
  });
});
