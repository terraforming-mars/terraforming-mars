import {expect} from 'chai';
import {CForester, Forester} from '../../../src/server/milestones/modular/Forester';
import {testGame} from '../../TestGame';
import {Resource} from '../../../src/common/Resource';
import {IMarsBot} from '../../../src/server/automa/MarsBotCorpTypes';
import {MarsBotBoard} from '../../../src/server/automa/MarsBotBoard';
import {THARSIS_MARSBOT_BOARD} from '../../../src/server/automa/boards/TharsisMarsBot';

describe('Forester', () => {
  it('Can claim with 4 plant production', () => {
    const milestone = new Forester();
    const [, player] = testGame(2);
    player.production.add(Resource.PLANTS, 3);
    expect(milestone.canClaim(player)).is.false;

    player.production.add(Resource.PLANTS, 1);
    expect(milestone.canClaim(player)).is.true;
  });

  it('MarsBot claims Forester at space 6 of its bio track', () => {
    const milestone = new Forester();
    const board = new MarsBotBoard(THARSIS_MARSBOT_BOARD);
    const bot = {board} as unknown as IMarsBot;
    for (let i = 0; i < 5; i++) {
      board.tracks[6].advance();
    }
    expect(milestone.marsBotCanClaim(bot)).is.false;

    board.tracks[6].advance();
    expect(milestone.marsBotCanClaim(bot)).is.true;
  });

  it('MarsBot claims C. Forester at space 10 of its bio track', () => {
    const milestone = new CForester();
    const board = new MarsBotBoard(THARSIS_MARSBOT_BOARD);
    const bot = {board} as unknown as IMarsBot;
    for (let i = 0; i < 9; i++) {
      board.tracks[6].advance();
    }
    expect(milestone.marsBotCanClaim(bot)).is.false;

    board.tracks[6].advance();
    expect(milestone.marsBotCanClaim(bot)).is.true;
  });
});
