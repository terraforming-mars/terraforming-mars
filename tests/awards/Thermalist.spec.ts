import {expect} from 'chai';
import {Thermalist} from '../../src/server/awards/Thermalist';
import {IMarsBot} from '../../src/server/automa/MarsBotCorpTypes';
import {MarsBotBoard} from '../../src/server/automa/MarsBotBoard';
import {THARSIS_MARSBOT_BOARD} from '../../src/server/automa/boards/TharsisMarsBot';
import {testGame} from '../TestGame';

describe('Thermalist', () => {
  const award = new Thermalist();

  it('scores a player by energy, heat and heat production mid game', () => {
    const [, player] = testGame(2);
    player.energy = 2;
    player.heat = 3;

    expect(award.getScore(player)).to.eq(5);
  });

  it('scores MarsBot by its fifth track plus 5', () => {
    const board = new MarsBotBoard(THARSIS_MARSBOT_BOARD);
    for (let i = 0; i < 4; i++) {
      board.tracks[4].advance();
    }

    expect(award.marsBotScore({board} as unknown as IMarsBot)).to.eq(9);
  });
});
