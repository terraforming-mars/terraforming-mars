import {expect} from 'chai';
import {Tag} from '@/common/cards/Tag';
import {THARSIS_MARSBOT_BOARD} from '@/server/automa/boards/TharsisMarsBot';
import {VENUS_MARSBOT_TRACK} from '@/server/automa/boards/VenusMarsBot';
import {Specialist} from '@/server/milestones/Specialist';
import {fakeMarsBot, setTrack} from '../automa/FakeMarsBot';

describe('Specialist', () => {
  it('MarsBot needs space 10 on any one track, Venus included', () => {
    for (const run of [
      {tag: Tag.SCIENCE, position: 9, expected: false},
      {tag: Tag.SCIENCE, position: 10, expected: true},
      {tag: Tag.VENUS, position: 10, expected: true},
    ]) {
      const bot = fakeMarsBot([...THARSIS_MARSBOT_BOARD, VENUS_MARSBOT_TRACK]);
      setTrack(bot, run.tag, run.position);

      expect(new Specialist().marsBotCanClaim(bot), JSON.stringify(run)).eq(run.expected);
    }
  });
});
