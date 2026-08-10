import {expect} from 'chai';
import {Miner} from '../../src/server/awards/Miner';
import {IMarsBot} from '../../src/server/automa/MarsBotCorpTypes';
import {MarsBotBoard} from '../../src/server/automa/MarsBotBoard';
import {THARSIS_MARSBOT_BOARD} from '../../src/server/automa/boards/TharsisMarsBot';
import {testGame} from '../TestGame';

describe('Miner', () => {
  const award = new Miner();

  it('scores a player by steel and titanium mid game', () => {
    const [, player] = testGame(2);
    player.steel = 3;
    player.titanium = 2;

    expect(award.getScore(player)).to.eq(5);
  });

  it('scores MarsBot by its second track plus 5', () => {
    const board = new MarsBotBoard(THARSIS_MARSBOT_BOARD);
    for (let i = 0; i < 3; i++) {
      board.tracks[1].advance();
    }

    expect(award.marsBotScore({board} as unknown as IMarsBot)).to.eq(8);
  });
});
