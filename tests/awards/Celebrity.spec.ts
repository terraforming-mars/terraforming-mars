import {expect} from 'chai';
import {CardType} from '@/common/cards/CardType';
import {Celebrity} from '@/server/awards/Celebrity';
import {fakeCard} from '../TestingUtils';
import {fakeMarsBot} from '../automa/FakeMarsBot';

describe('Celebrity', () => {
  it('MarsBot counts the cards costing 20 M€ or more in its played pile, events included', () => {
    const playedProjectCards = [
      fakeCard({cost: 20, type: CardType.EVENT}),
      fakeCard({cost: 25, type: CardType.ACTIVE}),
      fakeCard({cost: 19, type: CardType.AUTOMATED}),
    ];
    const bot = {...fakeMarsBot(), playedProjectCards};

    expect(new Celebrity().marsBotScore(bot)).eq(2);
  });
});
