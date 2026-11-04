import {expect} from 'chai';
import {CardType} from '@/common/cards/CardType';
import {Legend} from '@/server/milestones/Legend';
import {fakeCard} from '../TestingUtils';
import {fakeMarsBot} from '../automa/FakeMarsBot';

describe('Legend', () => {
  it('MarsBot needs 5 events in its played pile', () => {
    for (const run of [
      {events: 4, expected: false},
      {events: 5, expected: true},
    ]) {
      const types = [CardType.ACTIVE, CardType.AUTOMATED, ...Array<CardType>(run.events).fill(CardType.EVENT)];
      const bot = {...fakeMarsBot(), playedProjectCards: types.map((type) => fakeCard({type}))};

      expect(new Legend().marsBotCanClaim(bot), JSON.stringify(run)).eq(run.expected);
    }
  });
});
