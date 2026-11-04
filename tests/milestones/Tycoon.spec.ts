import {expect} from 'chai';
import {CardType} from '@/common/cards/CardType';
import {Tycoon} from '@/server/milestones/Tycoon';
import {fakeCard} from '../TestingUtils';
import {fakeMarsBot} from '../automa/FakeMarsBot';

describe('Tycoon', () => {
  it('MarsBot needs 15 blue and green cards in its played pile, events aside', () => {
    for (const run of [
      {cards: 14, expected: false},
      {cards: 15, expected: true},
    ]) {
      const types = [CardType.EVENT, CardType.EVENT, ...Array<CardType>(run.cards).fill(CardType.ACTIVE)];
      const bot = {...fakeMarsBot(), playedProjectCards: types.map((type) => fakeCard({type}))};

      expect(new Tycoon().marsBotCanClaim(bot), JSON.stringify(run)).eq(run.expected);
    }
  });
});
