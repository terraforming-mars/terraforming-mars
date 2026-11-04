import {expect} from 'chai';
import {CardType} from '@/common/cards/CardType';
import {Magnate} from '@/server/awards/Magnate';
import {fakeCard} from '../TestingUtils';
import {fakeMarsBot} from '../automa/FakeMarsBot';

describe('Magnate', () => {
  it('MarsBot counts the green cards in its played pile', () => {
    const types = [CardType.EVENT, CardType.AUTOMATED, CardType.ACTIVE, CardType.AUTOMATED];
    const bot = {...fakeMarsBot(), playedProjectCards: types.map((type) => fakeCard({type}))};

    expect(new Magnate().marsBotScore(bot)).eq(2);
  });
});
