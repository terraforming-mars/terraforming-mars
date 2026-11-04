import {expect} from 'chai';
import {Tag} from '@/common/cards/Tag';
import {Forester} from '@/server/milestones/modular/Forester';
import {fakeMarsBot, setTrack} from '../../automa/FakeMarsBot';

describe('Forester', () => {
  it('MarsBot needs space 6 of its Bio track', () => {
    for (const run of [
      {plant: 5, expected: false},
      {plant: 6, expected: true},
    ]) {
      const bot = fakeMarsBot();
      setTrack(bot, Tag.PLANT, run.plant);

      expect(new Forester().marsBotCanClaim(bot), JSON.stringify(run)).eq(run.expected);
    }
  });
});
