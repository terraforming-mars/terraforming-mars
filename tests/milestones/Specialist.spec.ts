import {expect} from 'chai';
import {Specialist} from '../../src/server/milestones/Specialist';
import {testGame} from '../TestGame';
import {IMarsBot} from '../../src/server/automa/MarsBotCorpTypes';
import {MarsBotBoard} from '../../src/server/automa/MarsBotBoard';
import {THARSIS_MARSBOT_BOARD} from '../../src/server/automa/boards/TharsisMarsBot';

describe('Specialist', () => {
  const milestone = new Specialist();

  it('Can claim with 10 production of one resource', () => {
    const [, player] = testGame(2);
    player.production.override({energy: 9});
    expect(milestone.canClaim(player)).is.false;

    player.production.override({energy: 10});
    expect(milestone.canClaim(player)).is.true;
  });

  it('MarsBot claims it with any one track at space 10', () => {
    const board = new MarsBotBoard(THARSIS_MARSBOT_BOARD);
    const bot = {board} as unknown as IMarsBot;
    for (let i = 0; i < 9; i++) {
      board.tracks[3].advance();
    }
    expect(milestone.marsBotCanClaim(bot)).is.false;

    board.tracks[3].advance();
    expect(milestone.marsBotCanClaim(bot)).is.true;
  });
});
