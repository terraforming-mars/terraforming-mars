import {expect} from 'chai';
import {AZoologist} from '../../../src/server/awards/amazonisPlanitia/AZoologist';
import {TestPlayer} from '../../TestPlayer';
import {fakeCard} from '../../TestingUtils';
import {CardResource} from '../../../src/common/CardResource';
import {IMarsBot} from '../../../src/server/automa/MarsBotCorpTypes';
import {MarsBotBoard} from '../../../src/server/automa/MarsBotBoard';
import {THARSIS_MARSBOT_BOARD} from '../../../src/server/automa/boards/TharsisMarsBot';

describe('AZoologist', () => {
  const award = new AZoologist();

  it('scores a player by animal and microbe resources', () => {
    const player = TestPlayer.BLUE.newPlayer();
    const animals = fakeCard({resourceType: CardResource.ANIMAL});
    animals.resourceCount = 3;
    const floaters = fakeCard({resourceType: CardResource.FLOATER});
    floaters.resourceCount = 2;
    player.playedCards.push(animals, floaters);

    expect(award.getScore(player)).to.eq(3);
  });

  it('scores MarsBot by its bio track plus 5', () => {
    const board = new MarsBotBoard(THARSIS_MARSBOT_BOARD);
    const bot = {board} as unknown as IMarsBot;
    for (let i = 0; i < 4; i++) {
      board.tracks[6].advance();
    }

    expect(award.marsBotScore(bot)).to.eq(9);
  });
});
