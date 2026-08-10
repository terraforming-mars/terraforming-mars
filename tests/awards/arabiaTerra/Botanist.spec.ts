import {expect} from 'chai';
import {Botanist} from '../../../src/server/awards/arabiaTerra/Botanist';
import {testGame} from '../../TestGame';
import {Resource} from '../../../src/common/Resource';
import {IMarsBot} from '../../../src/server/automa/MarsBotCorpTypes';
import {MarsBotBoard} from '../../../src/server/automa/MarsBotBoard';
import {THARSIS_MARSBOT_BOARD} from '../../../src/server/automa/boards/TharsisMarsBot';

describe('Botanist', () => {
  const award = new Botanist();

  it('scores a player by plant production', () => {
    const [, player] = testGame(2);
    player.production.add(Resource.PLANTS, 4);

    expect(award.getScore(player)).to.eq(4);
  });

  it('scores MarsBot by its bio track minus 2', () => {
    const board = new MarsBotBoard(THARSIS_MARSBOT_BOARD);
    const bot = {board} as unknown as IMarsBot;
    for (let i = 0; i < 5; i++) {
      board.tracks[6].advance();
    }
    expect(award.marsBotScore(bot)).to.eq(3);
  });

  it('MarsBot never scores below zero', () => {
    const board = new MarsBotBoard(THARSIS_MARSBOT_BOARD);
    const bot = {board} as unknown as IMarsBot;
    board.tracks[6].advance();

    expect(award.marsBotScore(bot)).to.eq(0);
  });
});
