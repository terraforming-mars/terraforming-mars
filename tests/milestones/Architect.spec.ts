import {expect} from 'chai';
import {Architect} from '../../src/server/milestones/Architect';
import {TestPlayer} from '../TestPlayer';
import {IMarsBot} from '../../src/server/automa/MarsBotCorpTypes';
import {MarsBotBoard} from '../../src/server/automa/MarsBotBoard';
import {THARSIS_MARSBOT_BOARD} from '../../src/server/automa/boards/TharsisMarsBot';

describe('Architect', () => {
  const milestone = new Architect();

  it('Can claim with 3 city tags', () => {
    const player = TestPlayer.BLUE.newPlayer();
    player.tagsForTest = {city: 2};
    expect(milestone.canClaim(player)).is.false;

    player.tagsForTest = {city: 3};
    expect(milestone.canClaim(player)).is.true;
  });

  it('MarsBot claims it at space 6 of its city-tag track', () => {
    const board = new MarsBotBoard(THARSIS_MARSBOT_BOARD);
    const bot = {board} as unknown as IMarsBot;
    for (let i = 0; i < 5; i++) {
      board.tracks[5].advance();
    }
    expect(milestone.marsBotCanClaim(bot)).is.false;

    board.tracks[5].advance();
    expect(milestone.marsBotCanClaim(bot)).is.true;
  });
});
