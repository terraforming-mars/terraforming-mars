import {expect} from 'chai';
import {Ecologist} from '../../src/server/milestones/Ecologist';
import {TestPlayer} from '../TestPlayer';
import {IMarsBot} from '../../src/server/automa/MarsBotCorpTypes';
import {MarsBotBoard} from '../../src/server/automa/MarsBotBoard';
import {THARSIS_MARSBOT_BOARD} from '../../src/server/automa/boards/TharsisMarsBot';

describe('Ecologist', () => {
  const milestone = new Ecologist();

  it('Can claim with 4 bio tags', () => {
    const player = TestPlayer.BLUE.newPlayer();
    player.tagsForTest = {plant: 2, animal: 1};
    expect(milestone.canClaim(player)).is.false;

    player.tagsForTest = {plant: 2, animal: 1, microbe: 1};
    expect(milestone.canClaim(player)).is.true;
  });

  it('MarsBot claims it at space 4 of its bio track, counted once', () => {
    const board = new MarsBotBoard(THARSIS_MARSBOT_BOARD);
    const bot = {board} as unknown as IMarsBot;
    for (let i = 0; i < 3; i++) {
      board.tracks[6].advance();
    }
    // The three bio tags all point at this track; position 3 must not claim as 9
    expect(milestone.marsBotCanClaim(bot)).is.false;

    board.tracks[6].advance();
    expect(milestone.marsBotCanClaim(bot)).is.true;
  });
});
