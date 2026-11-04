import {expect} from 'chai';
import {Tag} from '@/common/cards/Tag';
import {Botanist} from '@/server/awards/arabiaTerra/Botanist';
import {fakeMarsBot, setTrack} from '../../automa/FakeMarsBot';

describe('Botanist', () => {
  it('MarsBot scores its Bio track minus 2, but not below 0', () => {
    for (const run of [
      {position: 6, expected: 4},
      {position: 1, expected: 0},
    ]) {
      const bot = fakeMarsBot();
      setTrack(bot, Tag.PLANT, run.position);

      expect(new Botanist().marsBotScore(bot), JSON.stringify(run)).eq(run.expected);
    }
  });
});
