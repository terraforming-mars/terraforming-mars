import {expect} from 'chai';
import {Banker} from '../../src/server/awards/Banker';
import {IMarsBot} from '../../src/server/automa/MarsBotCorpTypes';
import {MarsBotBoard} from '../../src/server/automa/MarsBotBoard';
import {THARSIS_MARSBOT_BOARD} from '../../src/server/automa/boards/TharsisMarsBot';
import {testGame} from '../TestGame';
import {Resource} from '../../src/common/Resource';

describe('Banker', () => {
  const award = new Banker();

  it('scores a player by M€ production', () => {
    const [, player] = testGame(2);
    player.production.add(Resource.MEGACREDITS, 4);

    expect(award.getScore(player)).to.eq(4);
  });

  it('scores MarsBot by its first and third tracks together', () => {
    const board = new MarsBotBoard(THARSIS_MARSBOT_BOARD);
    for (let i = 0; i < 3; i++) {
      board.tracks[0].advance();
    }
    for (let i = 0; i < 2; i++) {
      board.tracks[2].advance();
    }

    expect(award.marsBotScore({board} as unknown as IMarsBot)).to.eq(5);
  });
});
