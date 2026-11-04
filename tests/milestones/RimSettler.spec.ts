import {expect} from 'chai';
import {BoardName} from '@/common/boards/BoardName';
import {Tag} from '@/common/cards/Tag';
import {THARSIS_MARSBOT_BOARD} from '@/server/automa/boards/TharsisMarsBot';
import {RimSettler} from '@/server/milestones/RimSettler';
import {testGame} from '../TestGame';
import {fakeMarsBot, setTrack} from '../automa/FakeMarsBot';

describe('RimSettler', () => {
  it('MarsBot follows the Hellas rule, except with the Milestones & Awards expansion', () => {
    // Hellas pairs Jovian with Science, where Tharsis pairs it with Energy.
    const hellasTracks = THARSIS_MARSBOT_BOARD.map((track) => ({
      ...track,
      tags: track.tags.includes(Tag.SCIENCE) ? [...track.tags, Tag.JOVIAN] : track.tags.filter((tag) => tag !== Tag.JOVIAN),
    }));

    for (const run of [
      {modularMA: false, science: 5, power: 6, expected: false},
      {modularMA: false, science: 6, power: 0, expected: true},
      {modularMA: true, science: 6, power: 4, expected: false},
      {modularMA: true, science: 0, power: 5, expected: true},
    ]) {
      const [game] = testGame(1, {boardName: BoardName.HELLAS, modularMA: run.modularMA});
      const bot = {...fakeMarsBot(run.modularMA ? THARSIS_MARSBOT_BOARD : hellasTracks), game};
      setTrack(bot, Tag.SCIENCE, run.science);
      setTrack(bot, Tag.POWER, run.power);

      expect(new RimSettler().marsBotCanClaim(bot), JSON.stringify(run)).eq(run.expected);
    }
  });
});
