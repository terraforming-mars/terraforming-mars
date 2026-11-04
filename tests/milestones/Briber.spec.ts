import {expect} from 'chai';
import {Briber} from '@/server/milestones/Briber';
import {fakeMarsBot} from '../automa/FakeMarsBot';

describe('Briber', () => {
  it('MarsBot needs 20 M€', () => {
    for (const run of [
      {megacredits: 19, expected: false},
      {megacredits: 20, expected: true},
    ]) {
      const bot = {...fakeMarsBot(), megacredits: run.megacredits};

      expect(new Briber().marsBotCanClaim(bot), JSON.stringify(run)).eq(run.expected);
    }
  });
});
