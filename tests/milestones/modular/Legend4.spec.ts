import {expect} from 'chai';
import {CardType} from '@/common/cards/CardType';
import {Legend4} from '@/server/milestones/modular/Legend4';
import {fakeCard} from '../../TestingUtils';
import {fakeMarsBot} from '../../automa/FakeMarsBot';

describe('Legend4', () => {
  it('MarsBot needs 4 events in its played pile', () => {
    for (const run of [
      {events: 3, expected: false},
      {events: 4, expected: true},
    ]) {
      const types = [CardType.ACTIVE, CardType.AUTOMATED, ...Array<CardType>(run.events).fill(CardType.EVENT)];
      const bot = {...fakeMarsBot(), playedProjectCards: types.map((type) => fakeCard({type}))};

      expect(new Legend4().marsBotCanClaim(bot), JSON.stringify(run)).eq(run.expected);
    }
  });
});
