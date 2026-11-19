import {expect} from 'chai';
import {Tag} from '@/common/cards/Tag';
import {VSpacefarer} from '@/server/milestones/VSpacefarer';
import {fakeMarsBot, setTrack} from '../automa/FakeMarsBot';

describe('VSpacefarer', () => {
  it('MarsBot needs space 5 of its Space track', () => {
    for (const run of [
      {position: 4, expected: false},
      {position: 5, expected: true},
    ]) {
      const bot = fakeMarsBot();
      setTrack(bot, Tag.SPACE, run.position);

      expect(new VSpacefarer().marsBotCanClaim(bot), JSON.stringify(run)).eq(run.expected);
    }
  });
});
