import {expect} from 'chai';
import {RimSettler} from '../../src/server/milestones/RimSettler';
import {TestPlayer} from '../TestPlayer';
import {IMarsBot} from '../../src/server/automa/MarsBotCorpTypes';
import {MarsBotBoard} from '../../src/server/automa/MarsBotBoard';
import {THARSIS_MARSBOT_BOARD} from '../../src/server/automa/boards/TharsisMarsBot';

describe('RimSettler', () => {
  const milestone = new RimSettler();

  it('Can claim with 3 jovian tags', () => {
    const player = TestPlayer.BLUE.newPlayer();
    player.tagsForTest = {jovian: 2};
    expect(milestone.canClaim(player)).is.false;

    player.tagsForTest = {jovian: 3};
    expect(milestone.canClaim(player)).is.true;
  });

  it('MarsBot claims it at space 5 of its Jovian track', () => {
    const board = new MarsBotBoard(THARSIS_MARSBOT_BOARD);
    const bot = {board} as unknown as IMarsBot;
    for (let i = 0; i < 4; i++) {
      board.tracks[4].advance();
    }
    expect(milestone.marsBotCanClaim(bot)).is.false;

    board.tracks[4].advance();
    expect(milestone.marsBotCanClaim(bot)).is.true;
  });
});
