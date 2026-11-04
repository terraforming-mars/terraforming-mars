import {expect} from 'chai';
import {Tactician4} from '@/server/milestones/modular/Tactician4';
import {fakeMarsBot} from '../../automa/FakeMarsBot';

describe('Tactician4', () => {
  it('MarsBot needs 30 M€', () => {
    for (const run of [
      {megacredits: 29, expected: false},
      {megacredits: 30, expected: true},
    ]) {
      const bot = {...fakeMarsBot(), megacredits: run.megacredits};

      expect(new Tactician4().marsBotCanClaim(bot), JSON.stringify(run)).eq(run.expected);
    }
  });
});
