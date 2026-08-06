import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {Fundraiser} from '../../../src/server/milestones/modular/Fundraiser';
import {TestPlayer} from '../../TestPlayer';
import {Resource} from '../../../src/common/Resource';
import {IMarsBot} from '../../../src/server/automa/MarsBotCorpTypes';
import {MarsBotBoard} from '../../../src/server/automa/MarsBotBoard';
import {THARSIS_MARSBOT_BOARD} from '../../../src/server/automa/boards/TharsisMarsBot';

describe('Fundraiser', () => {
  let milestone: Fundraiser;
  let player: TestPlayer;

  beforeEach(() => {
    milestone = new Fundraiser();
    [/* game */, player] = testGame(2);
  });

  it('Cannot claim with zero production', () => {
    expect(milestone.canClaim(player)).is.false;
  });

  it('Cannot claim with less than 12 production', () => {
    player.production.add(Resource.MEGACREDITS, 8);

    expect(milestone.canClaim(player)).is.false;
  });

  it('Can claim with exactly 12 production', () => {
    player.production.add(Resource.MEGACREDITS, 12);

    expect(milestone.canClaim(player)).is.true;
  });

  it('Can claim with more than 12 production', () => {
    player.production.add(Resource.MEGACREDITS, 15);

    expect(milestone.canClaim(player)).is.true;
  });

  it('MarsBot claims it at space 8 of its M€ track', () => {
    const board = new MarsBotBoard(THARSIS_MARSBOT_BOARD);
    const bot = {board} as unknown as IMarsBot;
    for (let i = 0; i < 7; i++) {
      board.tracks[2].advance();
    }
    expect(milestone.marsBotCanClaim(bot)).is.false;

    board.tracks[2].advance();
    expect(milestone.marsBotCanClaim(bot)).is.true;
  });
});
