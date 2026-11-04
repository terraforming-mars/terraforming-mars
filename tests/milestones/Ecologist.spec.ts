import {expect} from 'chai';
import {Tag} from '@/common/cards/Tag';
import {Ecologist} from '@/server/milestones/Ecologist';
import {fakeMarsBot, setTrack} from '../automa/FakeMarsBot';

describe('Ecologist', () => {
  it('MarsBot needs space 4 of its Bio track', () => {
    for (const run of [
      {plant: 3, expected: false},
      {plant: 4, expected: true},
    ]) {
      const bot = fakeMarsBot();
      setTrack(bot, Tag.PLANT, run.plant);

      expect(new Ecologist().marsBotCanClaim(bot), JSON.stringify(run)).eq(run.expected);
    }
  });
});
