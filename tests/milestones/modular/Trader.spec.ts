import {expect} from 'chai';
import {Trader} from '../../../src/server/milestones/modular/Trader';
import {TestPlayer} from '../../TestPlayer';
import {fakeCard} from '../../TestingUtils';
import {CardResource} from '../../../src/common/CardResource';
import {IMarsBot} from '../../../src/server/automa/MarsBotCorpTypes';
import {MarsBotBoard} from '../../../src/server/automa/MarsBotBoard';
import {THARSIS_MARSBOT_BOARD} from '../../../src/server/automa/boards/TharsisMarsBot';
import {VENUS_MARSBOT_TRACK} from '../../../src/server/automa/boards/VenusMarsBot';

describe('Trader', () => {
  const milestone = new Trader();

  it('Can claim with 3 resource types on cards', () => {
    const player = TestPlayer.BLUE.newPlayer();
    for (const resourceType of [CardResource.MICROBE, CardResource.ANIMAL]) {
      const card = fakeCard({resourceType});
      card.resourceCount = 1;
      player.playedCards.push(card);
    }
    expect(milestone.canClaim(player)).is.false;

    const floaters = fakeCard({resourceType: CardResource.FLOATER});
    floaters.resourceCount = 1;
    player.playedCards.push(floaters);
    expect(milestone.canClaim(player)).is.true;
  });

  it('MarsBot claims it with bio, earth and Venus tracks at space 2', () => {
    const board = new MarsBotBoard([...THARSIS_MARSBOT_BOARD, VENUS_MARSBOT_TRACK]);
    const bot = {board} as unknown as IMarsBot;
    for (const index of [5, 6]) {
      board.tracks[index].advance();
      board.tracks[index].advance();
    }
    board.tracks[7].advance();
    expect(milestone.marsBotCanClaim(bot)).is.false;

    board.tracks[7].advance();
    expect(milestone.marsBotCanClaim(bot)).is.true;
  });
});
