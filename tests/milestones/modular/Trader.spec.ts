import {expect} from 'chai';
import {Tag} from '@/common/cards/Tag';
import {THARSIS_MARSBOT_BOARD} from '@/server/automa/boards/TharsisMarsBot';
import {VENUS_MARSBOT_TRACK} from '@/server/automa/boards/VenusMarsBot';
import {Trader} from '@/server/milestones/modular/Trader';
import {fakeMarsBot, setTrack} from '../../automa/FakeMarsBot';

describe('Trader', () => {
  it('MarsBot needs space 2 on its Bio, Earth and Venus tracks', () => {
    for (const run of [
      {plant: 1, earth: 2, venus: 2, expected: false},
      {plant: 2, earth: 1, venus: 2, expected: false},
      {plant: 2, earth: 2, venus: 1, expected: false},
      {plant: 2, earth: 2, venus: 2, expected: true},
    ]) {
      const bot = fakeMarsBot([...THARSIS_MARSBOT_BOARD, VENUS_MARSBOT_TRACK]);
      setTrack(bot, Tag.PLANT, run.plant);
      setTrack(bot, Tag.EARTH, run.earth);
      setTrack(bot, Tag.VENUS, run.venus);

      expect(new Trader().marsBotCanClaim(bot), JSON.stringify(run)).eq(run.expected);
    }
  });
});
