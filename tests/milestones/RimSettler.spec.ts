import {expect} from 'chai';
import {BoardName} from '@/common/boards/BoardName';
import {Tag} from '@/common/cards/Tag';
import {THARSIS_MARSBOT_BOARD} from '@/server/automa/boards/TharsisMarsBot';
import {RimSettler} from '@/server/milestones/RimSettler';
import {testGame} from '../TestGame';
import {fakeMarsBot, setTrack} from '../automa/FakeMarsBot';
import {TestPlayer} from '../TestPlayer';

describe('RimSettler', () => {
  it('Can claim with 3 jovian tags', () => {
    const milestone = new RimSettler();
    const player = TestPlayer.BLUE.newPlayer();
    player.tagsForTest = {jovian: 2};
    expect(milestone.canClaim(player)).is.false;

    player.tagsForTest = {jovian: 3};
    expect(milestone.canClaim(player)).is.true;
  });

  it('MarsBot reads its Jovian track on Hellas and its Energy track elsewhere', () => {
    // Hellas and Elysium pair Jovian with Science, where Tharsis pairs it with Energy.
    const scienceJovianTracks = THARSIS_MARSBOT_BOARD.map((track) => ({
      ...track,
      tags: track.tags.includes(Tag.SCIENCE) ? [...track.tags, Tag.JOVIAN] : track.tags.filter((tag) => tag !== Tag.JOVIAN),
    }));

    for (const run of [
      {boardName: BoardName.HELLAS, modularMA: false, science: 5, power: 6, expected: false},
      {boardName: BoardName.HELLAS, modularMA: false, science: 6, power: 0, expected: true},
      {boardName: BoardName.HELLAS, modularMA: true, science: 6, power: 4, expected: false},
      {boardName: BoardName.HELLAS, modularMA: true, science: 0, power: 5, expected: true},
      {boardName: BoardName.ELYSIUM, modularMA: false, science: 6, power: 4, expected: false},
    ]) {
      const [game] = testGame(1, {boardName: run.boardName, modularMA: run.modularMA});
      // The Milestones & Awards expansion plays MarsBot's Tharsis board on any map.
      const bot = fakeMarsBot({tracks: run.modularMA ? THARSIS_MARSBOT_BOARD : scienceJovianTracks, game});
      setTrack(bot, Tag.SCIENCE, run.science);
      setTrack(bot, Tag.POWER, run.power);

      expect(new RimSettler().marsBotCanClaim(bot), JSON.stringify(run)).eq(run.expected);
    }
  });
});
