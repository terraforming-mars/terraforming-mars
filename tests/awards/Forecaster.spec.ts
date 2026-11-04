import {expect} from 'chai';
import {Forecaster} from '@/server/awards/Forecaster';
import {fakeMarsBot} from '../automa/FakeMarsBot';

describe('Forecaster', () => {
  it('MarsBot counts every 7 M€ as one card with a requirement', () => {
    for (const run of [
      {megacredits: 6, expected: 0},
      {megacredits: 7, expected: 1},
      {megacredits: 20, expected: 2},
    ]) {
      const bot = {...fakeMarsBot(), megacredits: run.megacredits};

      expect(new Forecaster().marsBotScore(bot), JSON.stringify(run)).eq(run.expected);
    }
  });
});
