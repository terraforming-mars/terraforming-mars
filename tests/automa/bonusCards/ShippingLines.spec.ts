import {expect} from 'chai';
import {CardName} from '@/common/cards/CardName';
import {ShippingLines} from '@/server/automa/bonusCards/ShippingLines';
import {recordingMarsBot} from '../corps/RecordingMarsBot';

describe('ShippingLines', () => {
  it('trades with a colony', () => {
    const traded: Array<CardName> = [];
    const {marsBot} = recordingMarsBot({maybeTrade: (cardName) => traded.push(cardName)});

    expect(new ShippingLines().resolve(marsBot)).is.false;
    expect(traded).deep.eq([CardName.AUTOMA_SHIPPING_LINES]);
  });
});
