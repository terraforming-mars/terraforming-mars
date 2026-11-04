import {expect} from 'chai';
import {Excentric} from '@/server/awards/Excentric';
import {fakeMarsBot} from '../automa/FakeMarsBot';

describe('Excentric', () => {
  it('MarsBot counts every 5 M€ as one resource', () => {
    for (const run of [
      {megacredits: 4, expected: 0},
      {megacredits: 5, expected: 1},
      {megacredits: 14, expected: 2},
    ]) {
      const bot = {...fakeMarsBot(), megacredits: run.megacredits};

      expect(new Excentric().marsBotScore(bot), JSON.stringify(run)).eq(run.expected);
    }
  });
});
