import {expect} from 'chai';
import {Diversifier} from '../../src/server/milestones/Diversifier';
import {TestPlayer} from '../TestPlayer';
import {Leavitt} from '../../src/server/cards/community/Leavitt';
import {AntiGravityTechnology} from '../../src/server/cards/base/AntiGravityTechnology';
import {testGame} from '../TestGame';
import {fakeCard} from '../TestingUtils';
import {Tag} from '../../src/common/cards/Tag';
import {IMarsBot} from '../../src/server/automa/MarsBotCorpTypes';
import {MarsBotBoard} from '../../src/server/automa/MarsBotBoard';
import {THARSIS_MARSBOT_BOARD} from '../../src/server/automa/boards/TharsisMarsBot';
import {VENUS_MARSBOT_TRACK} from '../../src/server/automa/boards/VenusMarsBot';

describe('Diversifier', () => {
  let milestone: Diversifier;
  let player: TestPlayer;

  beforeEach(() => {
    milestone = new Diversifier();
    [/* game */, player] = testGame(2);
  });

  it('Counts wild tags tags as unique tags', () => {
    const milestone = new Diversifier();
    player.playedCards.push(fakeCard({tags: [Tag.WILD, Tag.WILD, Tag.WILD, Tag.WILD, Tag.WILD, Tag.WILD, Tag.WILD]}));
    expect(milestone.canClaim(player)).is.not.true;
    player.playedCards.push(fakeCard({tags: [Tag.WILD]}));
    expect(milestone.canClaim(player)).is.true;
  });

  it('Counts Leavitt science tag placement bonus', () => {
    const [game, player] = testGame(1, {coloniesExtension: true});
    const leavitt = new Leavitt();
    game.colonies = [leavitt];

    leavitt.addColony(player);
    expect(milestone.getScore(player)).eq(1);

    // Adding a second colony doesn't change things
    leavitt.addColony(player);
    expect(milestone.getScore(player)).eq(1);

    // Or another science card.
    player.playedCards.push(new AntiGravityTechnology());
    expect(milestone.getScore(player)).eq(1);

    player.playedCards.push(fakeCard({tags: [Tag.WILD, Tag.WILD, Tag.WILD, Tag.WILD, Tag.WILD, Tag.WILD, Tag.WILD]}));
    expect(milestone.getScore(player)).eq(8);
    expect(milestone.canClaim(player)).is.true;
  });

  it('MarsBot claims it with every Mars track at space 3', () => {
    const board = new MarsBotBoard(THARSIS_MARSBOT_BOARD);
    const bot = {board} as unknown as IMarsBot;
    for (let index = 0; index < 6; index++) {
      for (let i = 0; i < 3; i++) {
        board.tracks[index].advance();
      }
    }
    board.tracks[6].advance();
    board.tracks[6].advance();
    expect(milestone.marsBotCanClaim(bot)).is.false;

    board.tracks[6].advance();
    expect(milestone.marsBotCanClaim(bot)).is.true;
  });

  it('the Venus track can stand in for a Mars track', () => {
    const board = new MarsBotBoard([...THARSIS_MARSBOT_BOARD, VENUS_MARSBOT_TRACK]);
    const bot = {board} as unknown as IMarsBot;
    for (let index = 0; index < 6; index++) {
      for (let i = 0; i < 3; i++) {
        board.tracks[index].advance();
      }
    }
    expect(milestone.marsBotCanClaim(bot)).is.false;

    for (let i = 0; i < 3; i++) {
      board.tracks[7].advance();
    }
    expect(milestone.marsBotCanClaim(bot)).is.true;
  });
});
