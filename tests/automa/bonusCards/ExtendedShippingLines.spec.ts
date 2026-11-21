import {expect} from 'chai';
import {CardName} from '@/common/cards/CardName';
import {ExtendedShippingLines} from '@/server/automa/bonusCards/ExtendedShippingLines';
import {recordingMarsBot} from '../corps/RecordingMarsBot';

describe('ExtendedShippingLines', () => {
  it('trades with a colony', () => {
    const traded: Array<CardName> = [];
    const {marsBot} = recordingMarsBot({maybeTrade: (cardName) => traded.push(cardName)});

    expect(new ExtendedShippingLines().resolve(marsBot)).is.false;
    expect(traded).deep.eq([CardName.AUTOMA_EXTENDED_SHIPPING_LINES]);
  });
});
