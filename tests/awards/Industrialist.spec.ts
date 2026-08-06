import {expect} from 'chai';
import {Industrialist} from '../../src/server/awards/Industrialist';
import {testGame} from '../TestGame';
import {IMarsBot} from '../../src/server/automa/MarsBotCorpTypes';
import {MarsBotBoard} from '../../src/server/automa/MarsBotBoard';
import {THARSIS_MARSBOT_BOARD} from '../../src/server/automa/boards/TharsisMarsBot';

describe('Industrialist', () => {
  const award = new Industrialist();

  it('scores a player by steel plus steel and energy production mid game', () => {
    const [, player] = testGame(2);
    player.steel = 3;
    player.production.override({steel: 2, energy: 1});

    expect(award.getScore(player)).to.eq(6);
  });

  it('scores MarsBot by its power track plus 5', () => {
    const board = new MarsBotBoard(THARSIS_MARSBOT_BOARD);
    for (let i = 0; i < 4; i++) {
      board.tracks[4].advance();
    }

    expect(award.marsBotScore({board} as unknown as IMarsBot)).to.eq(9);
  });
});
