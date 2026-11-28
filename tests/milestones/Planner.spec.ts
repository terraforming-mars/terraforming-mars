import {expect} from 'chai';
import {Tag} from '@/common/cards/Tag';
import {THARSIS_MARSBOT_BOARD} from '@/server/automa/boards/TharsisMarsBot';
import {VENUS_MARSBOT_TRACK} from '@/server/automa/boards/VenusMarsBot';
import {Planner} from '@/server/milestones/Planner';
import {fakeMarsBot, setAllTracks, setTrack} from '../automa/FakeMarsBot';

describe('Planner', () => {
  for (const run of [
    {tag: Tag.PLANT, position: 3, expected: false},
    {tag: Tag.PLANT, position: 4, expected: true},
  ] as const) {
    it('MarsBot needs space 4 on every track except Venus: ' + JSON.stringify(run), () => {
      const marsBot = fakeMarsBot({tracks: [...THARSIS_MARSBOT_BOARD, VENUS_MARSBOT_TRACK]});
      setAllTracks(marsBot, 4);
      setTrack(marsBot, Tag.VENUS, 0);

      setTrack(marsBot, run.tag, run.position);
      expect(new Planner().marsBotCanClaim(marsBot)).eq(run.expected);
    });
  }
});
