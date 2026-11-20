import {expect} from 'chai';
import {CardName} from '@/common/cards/CardName';
import {ExtendedShippingLinesMarsBot} from '@/server/automa/bonusCards/ExtendedShippingLinesMarsBot';
import {recordingMarsBot} from '../corps/RecordingMarsBot';

describe('ExtendedShippingLinesMarsBot', () => {
  it('trades with a colony', () => {
    const traded: Array<CardName> = [];
    const {marsBot} = recordingMarsBot({maybeTrade: (cardName) => traded.push(cardName)});

    expect(new ExtendedShippingLinesMarsBot().resolve(marsBot)).is.false;
    expect(traded).deep.eq([CardName.AUTOMA_EXTENDED_SHIPPING_LINES]);
  });
});
