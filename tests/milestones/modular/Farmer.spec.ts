import {expect} from 'chai';
import {Birds} from '../../../src/server/cards/base/Birds';
import {Ants} from '../../../src/server/cards/base/Ants';
import {Farmer} from '../../../src/server/milestones/modular/Farmer';
import {TestPlayer} from '../../TestPlayer';
import {IMarsBot} from '../../../src/server/automa/MarsBotCorpTypes';
import {MarsBotBoard} from '../../../src/server/automa/MarsBotBoard';
import {THARSIS_MARSBOT_BOARD} from '../../../src/server/automa/boards/TharsisMarsBot';

describe('Farmer', () => {
  let milestone: Farmer;
  let player: TestPlayer;

  beforeEach(() => {
    milestone = new Farmer();
    player = TestPlayer.BLUE.newPlayer();
  });

  it('Can claim with 5 animals or microbes', () => {
    const birds = new Birds();
    const ants = new Ants();
    player.playedCards.push(birds, ants);

    player.addResourceTo(ants);
    player.addResourceTo(ants);
    player.addResourceTo(birds);
    player.addResourceTo(birds);
    expect(milestone.canClaim(player)).is.false;

    player.addResourceTo(birds);
    expect(milestone.canClaim(player)).is.true;
  });

  it('MarsBot claims it at space 7 of its bio track', () => {
    const board = new MarsBotBoard(THARSIS_MARSBOT_BOARD);
    const bot = {board} as unknown as IMarsBot;
    for (let i = 0; i < 6; i++) {
      board.tracks[6].advance();
    }
    expect(milestone.marsBotCanClaim(bot)).is.false;

    board.tracks[6].advance();
    expect(milestone.marsBotCanClaim(bot)).is.true;
  });
});
