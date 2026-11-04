import {expect} from 'chai';
import {Tag} from '@/common/cards/Tag';
import {Architect} from '@/server/milestones/Architect';
import {fakeMarsBot, setTrack} from '../automa/FakeMarsBot';

describe('Architect', () => {
  it('MarsBot needs space 6 of its City track', () => {
    for (const run of [
      {city: 5, expected: false},
      {city: 6, expected: true},
    ]) {
      const bot = fakeMarsBot();
      setTrack(bot, Tag.CITY, run.city);

      expect(new Architect().marsBotCanClaim(bot), JSON.stringify(run)).eq(run.expected);
    }
  });
});
