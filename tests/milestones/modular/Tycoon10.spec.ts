import {expect} from 'chai';
import {CardType} from '@/common/cards/CardType';
import {Tycoon10} from '@/server/milestones/modular/Tycoon10';
import {fakeCard} from '../../TestingUtils';
import {fakeMarsBot} from '../../automa/FakeMarsBot';

describe('Tycoon10', () => {
  it('MarsBot needs 10 blue and green cards in its played pile, events aside', () => {
    for (const run of [
      {cards: 9, expected: false},
      {cards: 10, expected: true},
    ]) {
      const types = [CardType.EVENT, CardType.EVENT, ...Array<CardType>(run.cards).fill(CardType.ACTIVE)];
      const bot = {...fakeMarsBot(), playedProjectCards: types.map((type) => fakeCard({type}))};

      expect(new Tycoon10().marsBotCanClaim(bot), JSON.stringify(run)).eq(run.expected);
    }
  });
});
