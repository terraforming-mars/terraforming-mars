import {expect} from 'chai';
import {Visionary} from '../../src/server/awards/Visionary';
import {testGame} from '../TestGame';
import {fakeCard} from '../TestingUtils';
import {IMarsBot} from '../../src/server/automa/MarsBotCorpTypes';
import {MarsBotBoard} from '../../src/server/automa/MarsBotBoard';
import {THARSIS_MARSBOT_BOARD} from '../../src/server/automa/boards/TharsisMarsBot';
import {VENUS_MARSBOT_TRACK} from '../../src/server/automa/boards/VenusMarsBot';

describe('Visionary', () => {
  const award = new Visionary();

  it('scores a player by cards in hand', () => {
    const [, player] = testGame(2);
    player.cardsInHand.push(fakeCard(), fakeCard());

    expect(award.getScore(player)).to.eq(2);
  });

  it('scores MarsBot by its least advanced track doubled', () => {
    const board = new MarsBotBoard(THARSIS_MARSBOT_BOARD);
    const game = {gameOptions: {venusNextExtension: false}};
    const bot = {board, game} as unknown as IMarsBot;
    for (let index = 0; index < 7; index++) {
      for (let step = 0; step <= index; step++) {
        board.tracks[index].advance();
      }
    }

    // Tracks run 1 to 7, so the lowest is 1
    expect(award.marsBotScore(bot)).to.eq(2);
  });

  it('with Venus, the second least advanced track counts', () => {
    const board = new MarsBotBoard([...THARSIS_MARSBOT_BOARD, VENUS_MARSBOT_TRACK]);
    const game = {gameOptions: {venusNextExtension: true}};
    const bot = {board, game} as unknown as IMarsBot;
    for (let index = 0; index < 7; index++) {
      for (let step = 0; step <= index; step++) {
        board.tracks[index].advance();
      }
    }

    // Venus sits lowest at 0, the Mars tracks run 1 to 7, so the second lowest is 1
    expect(award.marsBotScore(bot)).to.eq(2);
  });
});
