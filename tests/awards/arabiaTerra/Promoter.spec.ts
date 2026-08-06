import {expect} from 'chai';
import {Promoter} from '../../../src/server/awards/arabiaTerra/Promoter';
import {TestPlayer} from '../../TestPlayer';
import {fakeCard} from '../../TestingUtils';
import {CardType} from '../../../src/common/cards/CardType';
import {IMarsBot} from '../../../src/server/automa/MarsBotCorpTypes';
import {MarsBotBoard} from '../../../src/server/automa/MarsBotBoard';
import {THARSIS_MARSBOT_BOARD} from '../../../src/server/automa/boards/TharsisMarsBot';

describe('Promoter', () => {
  const award = new Promoter();

  it('scores a player by played events', () => {
    const player = TestPlayer.BLUE.newPlayer();
    player.playedCards.push(fakeCard({type: CardType.EVENT}));
    player.playedCards.push(fakeCard());

    expect(award.getScore(player)).to.eq(1);
  });

  it('scores MarsBot by its event track', () => {
    const board = new MarsBotBoard(THARSIS_MARSBOT_BOARD);
    const bot = {board} as unknown as IMarsBot;
    for (let i = 0; i < 4; i++) {
      board.tracks[2].advance();
    }

    expect(award.marsBotScore(bot)).to.eq(4);
  });
});
