import {expect} from 'chai';
import {VSpacefarer} from '../../src/server/milestones/VSpacefarer';
import {TestPlayer} from '../TestPlayer';
import {IMarsBot} from '../../src/server/automa/MarsBotCorpTypes';
import {MarsBotBoard} from '../../src/server/automa/MarsBotBoard';
import {THARSIS_MARSBOT_BOARD} from '../../src/server/automa/boards/TharsisMarsBot';

describe('VSpacefarer', () => {
  const milestone = new VSpacefarer();

  it('Can claim with 4 space tags', () => {
    const player = TestPlayer.BLUE.newPlayer();
    player.tagsForTest = {space: 3};
    expect(milestone.canClaim(player)).is.false;

    player.tagsForTest = {space: 4};
    expect(milestone.canClaim(player)).is.true;
  });

  it('MarsBot claims it at space 5 of its space track', () => {
    const board = new MarsBotBoard(THARSIS_MARSBOT_BOARD);
    const bot = {board} as unknown as IMarsBot;
    for (let i = 0; i < 4; i++) {
      board.tracks[1].advance();
    }
    expect(milestone.marsBotCanClaim(bot)).is.false;

    board.tracks[1].advance();
    expect(milestone.marsBotCanClaim(bot)).is.true;
  });
});
