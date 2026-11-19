import {expect} from 'chai';
import {Hoverlord} from '@/server/milestones/Hoverlord';
import {fakeMarsBot} from '../automa/FakeMarsBot';

describe('Hoverlord', () => {
  it('MarsBot counts the floaters on its Venus board', () => {
    for (const run of [
      {floaters: 6, expected: false},
      {floaters: 7, expected: true},
    ]) {
      const bot = fakeMarsBot({floaters: run.floaters});

      expect(new Hoverlord().marsBotCanClaim(bot), JSON.stringify(run)).eq(run.expected);
    }
  });
});
