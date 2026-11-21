import {expect} from 'chai';
import {CardName} from '@/common/cards/CardName';
import {ShippingLinesMarsBot} from '@/server/automa/bonusCards/ShippingLinesMarsBot';
import {recordingMarsBot} from '../corps/RecordingMarsBot';

describe('ShippingLinesMarsBot', () => {
  it('trades with a colony', () => {
    const traded: Array<CardName> = [];
    const {marsBot} = recordingMarsBot({maybeTrade: (cardName) => traded.push(cardName)});

    expect(new ShippingLinesMarsBot().resolve(marsBot)).is.false;
    expect(traded).deep.eq([CardName.AUTOMA_SHIPPING_LINES]);
  });
});
