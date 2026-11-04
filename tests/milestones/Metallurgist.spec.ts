import {expect} from 'chai';
import {Tag} from '@/common/cards/Tag';
import {Metallurgist} from '@/server/milestones/Metallurgist';
import {fakeMarsBot, setTrack} from '../automa/FakeMarsBot';

describe('Metallurgist', () => {
  it('MarsBot needs its Building and Space tracks to add up to 9', () => {
    for (const run of [
      {building: 4, space: 4, expected: false},
      {building: 4, space: 5, expected: true},
      {building: 5, space: 4, expected: true},
    ]) {
      const bot = fakeMarsBot();
      setTrack(bot, Tag.BUILDING, run.building);
      setTrack(bot, Tag.SPACE, run.space);

      expect(new Metallurgist().marsBotCanClaim(bot), JSON.stringify(run)).eq(run.expected);
    }
  });
});
