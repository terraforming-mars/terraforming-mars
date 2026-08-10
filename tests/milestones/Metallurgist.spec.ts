import {expect} from 'chai';
import {Metallurgist} from '../../src/server/milestones/Metallurgist';
import {testGame} from '../TestGame';
import {IMarsBot} from '../../src/server/automa/MarsBotCorpTypes';
import {MarsBotBoard} from '../../src/server/automa/MarsBotBoard';
import {THARSIS_MARSBOT_BOARD} from '../../src/server/automa/boards/TharsisMarsBot';

describe('Metallurgist', () => {
  const milestone = new Metallurgist();

  it('Can claim with 6 steel and titanium production', () => {
    const [, player] = testGame(2);
    player.production.override({steel: 3, titanium: 2});
    expect(milestone.canClaim(player)).is.false;

    player.production.override({steel: 3, titanium: 3});
    expect(milestone.canClaim(player)).is.true;
  });

  it('MarsBot claims it with building and space tracks summing to 9', () => {
    const board = new MarsBotBoard(THARSIS_MARSBOT_BOARD);
    const bot = {board} as unknown as IMarsBot;
    for (let i = 0; i < 5; i++) {
      board.tracks[0].advance();
    }
    for (let i = 0; i < 3; i++) {
      board.tracks[1].advance();
    }
    expect(milestone.marsBotCanClaim(bot)).is.false;

    board.tracks[1].advance();
    expect(milestone.marsBotCanClaim(bot)).is.true;
  });
});
