import {expect} from 'chai';
import {Tag} from '@/common/cards/Tag';
import {Blacksmith} from '@/server/awards/Blacksmith';
import {fakeMarsBot, setTrack} from '../automa/FakeMarsBot';

describe('Blacksmith', () => {
  it('MarsBot scores the higher of its Building and Space tracks', () => {
    for (const run of [
      {building: 3, space: 5, expected: 5},
      {building: 6, space: 2, expected: 6},
    ]) {
      const bot = fakeMarsBot();
      setTrack(bot, Tag.BUILDING, run.building);
      setTrack(bot, Tag.SPACE, run.space);

      expect(new Blacksmith().marsBotScore(bot), JSON.stringify(run)).eq(run.expected);
    }
  });
});
