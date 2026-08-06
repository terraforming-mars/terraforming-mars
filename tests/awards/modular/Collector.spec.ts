import {expect} from 'chai';
import {Collector} from '../../../src/server/awards/modular/Collector';
import {testGame} from '../../TestGame';
import {IMarsBot} from '../../../src/server/automa/MarsBotCorpTypes';
import {MarsBotBoard} from '../../../src/server/automa/MarsBotBoard';
import {THARSIS_MARSBOT_BOARD} from '../../../src/server/automa/boards/TharsisMarsBot';

describe('Collector', () => {
  const award = new Collector();

  it('scores a player by distinct resource types', () => {
    const [, player] = testGame(2);
    player.megaCredits = 3;
    player.steel = 1;
    player.heat = 2;

    expect(award.getScore(player)).to.eq(3);
  });

  it('scores MarsBot by the number of tracks at space 3', () => {
    const board = new MarsBotBoard(THARSIS_MARSBOT_BOARD);
    const bot = {board} as unknown as IMarsBot;
    for (const index of [0, 2, 5]) {
      for (let i = 0; i < 3; i++) {
        board.tracks[index].advance();
      }
    }
    board.tracks[1].advance();
    board.tracks[1].advance();

    expect(award.marsBotScore(bot)).to.eq(3);
  });
});
