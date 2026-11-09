import {expect} from 'chai';
import {Tag} from '@/common/cards/Tag';
import {VSpacefarer} from '@/server/milestones/VSpacefarer';
import {fakeMarsBot, setTrack} from '../automa/FakeMarsBot';

describe('VSpacefarer', () => {
  for (const run of [
    {position: 4, expected: false},
    {position: 5, expected: true},
  ] as const) {
    it(`MarsBot needs space 5 of its Space track, ${JSON.stringify(run)}`, () => {
      const bot = fakeMarsBot();
      setTrack(bot, Tag.SPACE, run.position);

      expect(new VSpacefarer().marsBotCanClaim(bot)).eq(run.expected);
    });
  }
});
