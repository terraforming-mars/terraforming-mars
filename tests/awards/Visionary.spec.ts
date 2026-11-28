import {expect} from 'chai';
import {Tag} from '@/common/cards/Tag';
import {THARSIS_MARSBOT_BOARD} from '@/server/automa/boards/TharsisMarsBot';
import {VENUS_MARSBOT_TRACK} from '@/server/automa/boards/VenusMarsBot';
import {Visionary} from '@/server/awards/Visionary';
import {testGame} from '../TestGame';
import {fakeMarsBot, setAllTracks, setTrack} from '../automa/FakeMarsBot';

describe('Visionary', () => {
  for (const run of [
    {venus: false, expected: 2},
    {venus: true, expected: 4},
  ] as const) {
    it('MarsBot scores its least advanced track doubled, the second least with Venus: ' + JSON.stringify(run), () => {
      const tracks = run.venus ? [...THARSIS_MARSBOT_BOARD, VENUS_MARSBOT_TRACK] : THARSIS_MARSBOT_BOARD;
      const [game] = testGame(1, {expansions: {venus: run.venus}});
      const marsBot = fakeMarsBot({tracks, game});
      setAllTracks(marsBot, 6);
      setTrack(marsBot, Tag.BUILDING, 1);
      setTrack(marsBot, Tag.SPACE, 4);
      if (run.venus) {
        setTrack(marsBot, Tag.VENUS, 2);
      }

      expect(new Visionary().marsBotScore(marsBot)).eq(run.expected);
    });
  }
});
