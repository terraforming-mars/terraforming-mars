import {expect} from 'chai';
import {Tag} from '@/common/cards/Tag';
import {THARSIS_MARSBOT_BOARD} from '@/server/automa/boards/TharsisMarsBot';
import {VENUS_MARSBOT_TRACK} from '@/server/automa/boards/VenusMarsBot';
import {Visionary} from '@/server/awards/Visionary';
import {testGame} from '../TestGame';
import {fakeMarsBot, setAllTracks, setTrack} from '../automa/FakeMarsBot';

describe('Visionary', () => {
  it('MarsBot scores its least advanced track doubled, the second least with Venus', () => {
    for (const run of [
      {venus: false, expected: 2},
      {venus: true, expected: 4},
    ]) {
      const tracks = run.venus ? [...THARSIS_MARSBOT_BOARD, VENUS_MARSBOT_TRACK] : THARSIS_MARSBOT_BOARD;
      const [game] = testGame(1, {venusNextExtension: run.venus});
      const bot = {...fakeMarsBot(tracks), game};
      setAllTracks(bot, 6);
      setTrack(bot, Tag.BUILDING, 1);
      setTrack(bot, Tag.SPACE, 4);
      if (run.venus) {
        setTrack(bot, Tag.VENUS, 2);
      }

      expect(new Visionary().marsBotScore(bot), JSON.stringify(run)).eq(run.expected);
    }
  });
});
