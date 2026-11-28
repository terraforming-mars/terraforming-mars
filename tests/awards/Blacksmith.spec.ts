import {expect} from 'chai';
import {Tag} from '@/common/cards/Tag';
import {Blacksmith} from '@/server/awards/Blacksmith';
import {fakeMarsBot, setTrack} from '../automa/FakeMarsBot';

describe('Blacksmith', () => {
  for (const run of [
    {building: 3, space: 5, expected: 5},
    {building: 6, space: 2, expected: 6},
  ] as const) {
    it('MarsBot scores the higher of its Building and Space tracks: ' + JSON.stringify(run), () => {
      const marsBot = fakeMarsBot();
      setTrack(marsBot, Tag.BUILDING, run.building);
      setTrack(marsBot, Tag.SPACE, run.space);

      expect(new Blacksmith().marsBotScore(marsBot)).eq(run.expected);
    });
  }
});
