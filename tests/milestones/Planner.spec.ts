import {expect} from 'chai';
import {Planner} from '../../src/server/milestones/Planner';
import {IMarsBot} from '../../src/server/automa/MarsBotCorpTypes';
import {MarsBotBoard} from '../../src/server/automa/MarsBotBoard';
import {THARSIS_MARSBOT_BOARD} from '../../src/server/automa/boards/TharsisMarsBot';
import {VENUS_MARSBOT_TRACK} from '../../src/server/automa/boards/VenusMarsBot';
import {testGame} from '../TestGame';
import {fakeCard} from '../TestingUtils';

function botWith(board: MarsBotBoard): IMarsBot {
  return {board} as unknown as IMarsBot;
}

function advanceAll(board: MarsBotBoard, count: number, steps: number): void {
  for (let index = 0; index < count; index++) {
    for (let step = 0; step < steps; step++) {
      board.tracks[index].advance();
    }
  }
}

describe('Planner', () => {
  const milestone = new Planner();

  it('can claim with 16 cards in hand', () => {
    const [, player] = testGame(2);
    expect(milestone.canClaim(player)).is.false;

    for (let i = 0; i < 16; i++) {
      player.cardsInHand.push(fakeCard());
    }
    expect(milestone.canClaim(player)).is.true;
  });

  it('MarsBot claims it with every Mars track at 4', () => {
    const board = new MarsBotBoard(THARSIS_MARSBOT_BOARD);
    advanceAll(board, 7, 4);

    expect(milestone.marsBotCanClaim(botWith(board))).is.true;
  });

  it('MarsBot cannot claim it with a Mars track below 4', () => {
    const board = new MarsBotBoard(THARSIS_MARSBOT_BOARD);
    advanceAll(board, 6, 4);
    board.tracks[6].advance();

    expect(milestone.marsBotCanClaim(botWith(board))).is.false;
  });

  it('the Venus track does not count against MarsBot', () => {
    const board = new MarsBotBoard([...THARSIS_MARSBOT_BOARD, VENUS_MARSBOT_TRACK]);
    advanceAll(board, 7, 4);

    expect(board.tracks[7].position).to.eq(0);
    expect(milestone.marsBotCanClaim(botWith(board))).is.true;
  });
});
