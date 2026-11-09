import {expect} from 'chai';
import {Hoverlord} from '@/server/milestones/Hoverlord';
import {fakeMarsBot} from '../automa/FakeMarsBot';

describe('Hoverlord', () => {
  for (const run of [
    {floaters: 6, expected: false},
    {floaters: 7, expected: true},
  ] as const) {
    it('MarsBot counts the floaters on its Venus board: ' + JSON.stringify(run), () => {
      const bot = fakeMarsBot({floaters: run.floaters});

      expect(new Hoverlord().marsBotCanClaim(bot)).eq(run.expected);
    });
  }
});
