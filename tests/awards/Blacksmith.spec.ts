import {expect} from 'chai';
import {Blacksmith} from '../../src/server/awards/Blacksmith';
import {testGame} from '../TestGame';
import {IMarsBot} from '../../src/server/automa/MarsBotCorpTypes';
import {MarsBotBoard} from '../../src/server/automa/MarsBotBoard';
import {THARSIS_MARSBOT_BOARD} from '../../src/server/automa/boards/TharsisMarsBot';

describe('Blacksmith', () => {
  const award = new Blacksmith();

  it('scores a player by steel and titanium production', () => {
    const [, player] = testGame(2);
    player.production.override({steel: 3, titanium: 2});

    expect(award.getScore(player)).to.eq(5);
  });

  it('scores MarsBot by the higher of its building and space tracks', () => {
    const board = new MarsBotBoard(THARSIS_MARSBOT_BOARD);
    const bot = {board} as unknown as IMarsBot;
    for (let i = 0; i < 3; i++) {
      board.tracks[0].advance();
    }
    for (let i = 0; i < 5; i++) {
      board.tracks[1].advance();
    }

    expect(award.marsBotScore(bot)).to.eq(5);
  });
});
