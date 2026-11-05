import {expect} from 'chai';
import {Tag} from '@/common/cards/Tag';
import {CForester} from '@/server/milestones/modular/Forester';
import {fakeMarsBot, setTrack} from '../../automa/FakeMarsBot';

describe('CForester', () => {
  it('MarsBot needs space 10 of its Bio track', () => {
    for (const run of [
      {plant: 9, expected: false},
      {plant: 10, expected: true},
    ]) {
      const bot = fakeMarsBot();
      setTrack(bot, Tag.PLANT, run.plant);

      expect(new CForester().marsBotCanClaim(bot), JSON.stringify(run)).eq(run.expected);
    }
  });
});
