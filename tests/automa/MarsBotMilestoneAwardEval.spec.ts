import {expect} from 'chai';
import {marsBotCanClaimMilestone, marsBotAwardScore, marsBotTrackPosition} from '../../src/server/automa/MarsBotMilestoneAwardEval';
import {IMarsBot} from '../../src/server/automa/MarsBotCorpTypes';
import {MarsBotBoard} from '../../src/server/automa/MarsBotBoard';
import {MarsBotTags} from '../../src/server/automa/MarsBotTags';
import {THARSIS_MARSBOT_BOARD} from '../../src/server/automa/boards/TharsisMarsBot';
import {Tag} from '../../src/common/cards/Tag';
import {testGame} from '../TestGame';
import {Builder} from '../../src/server/milestones/Builder';
import {Banker} from '../../src/server/awards/Banker';
import {Scientist} from '../../src/server/awards/Scientist';

/**
 * A bot whose player reads tags off the tracks, the way the game wires it. The dispatchers
 * only need the player and the board.
 */
function createBot() {
  const [game, player] = testGame(2);
  const board = new MarsBotBoard(THARSIS_MARSBOT_BOARD);
  player.tags = new MarsBotTags(player, board);
  const bot = {game, player, board} as unknown as IMarsBot;
  return {board, bot};
}

function advance(board: MarsBotBoard, index: number, steps: number): void {
  for (let step = 0; step < steps; step++) {
    board.tracks[index].advance();
  }
}

describe('MarsBotMilestoneAwardEval', () => {
  it('a milestone without an override runs the class against the bot player', () => {
    const {board, bot} = createBot();
    advance(board, 0, 8);

    expect(marsBotCanClaimMilestone(new Builder(), bot)).is.true;
  });

  it('the class sees the tracks, not played cards', () => {
    const {board, bot} = createBot();
    advance(board, 0, 7);

    expect(marsBotCanClaimMilestone(new Builder(), bot)).is.false;
  });

  it('an award without an override runs the class against the bot player', () => {
    const {board, bot} = createBot();
    advance(board, 3, 4);

    expect(marsBotAwardScore(new Scientist(), bot)).to.eq(4);
  });

  it('an award with an override uses it instead of the class', () => {
    const {board, bot} = createBot();
    advance(board, 0, 3);
    advance(board, 2, 2);

    // Banker reads M€ production for a player, and the bot's first and third tracks here.
    expect(marsBotAwardScore(new Banker(), bot)).to.eq(5);
  });

  it('marsBotTrackPosition reads the track carrying the tag', () => {
    const {board, bot} = createBot();
    advance(board, 4, 6);

    expect(marsBotTrackPosition(bot, Tag.POWER)).to.eq(6);
    expect(marsBotTrackPosition(bot, Tag.JOVIAN)).to.eq(6);
  });

  it('marsBotTrackPosition is 0 for a tag without a track', () => {
    const {bot} = createBot();

    expect(marsBotTrackPosition(bot, Tag.WILD)).to.eq(0);
  });
});
