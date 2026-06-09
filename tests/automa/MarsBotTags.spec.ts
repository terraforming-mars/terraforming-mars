import {expect} from 'chai';
import {testGame} from '../TestGame';
import {Tag} from '../../src/common/cards/Tag';
import {MarsBotBoard} from '../../src/server/automa/MarsBotBoard';
import {MarsBotTags} from '../../src/server/automa/MarsBotTags';
import {THARSIS_MARSBOT_BOARD} from '../../src/server/automa/boards/TharsisMarsBot';

describe('MarsBotTags', () => {
  function setup() {
    const [, player] = testGame(1);
    const board = new MarsBotBoard(THARSIS_MARSBOT_BOARD);
    return {board, tags: new MarsBotTags(player, board)};
  }

  it('counts a tag from its track position', () => {
    const {board, tags} = setup();
    board.tracks[0].advance();
    board.tracks[0].advance();
    board.tracks[0].advance();
    expect(tags.count(Tag.BUILDING, 'raw')).to.eq(3);
  });

  it('tags sharing a track share the count', () => {
    const {board, tags} = setup();
    for (let i = 0; i < 5; i++) {
      board.tracks[4].advance();
    }
    expect(tags.count(Tag.POWER, 'raw')).to.eq(5);
    expect(tags.count(Tag.JOVIAN, 'raw')).to.eq(5);
  });

  it('counts the event tag from its track', () => {
    const {board, tags} = setup();
    board.tracks[2].advance();
    expect(tags.count(Tag.EVENT, 'raw')).to.eq(1);
    expect(tags.countAllTags()[Tag.EVENT]).to.eq(1);
  });

  it('returns 0 for tags without a track', () => {
    const {tags} = setup();
    expect(tags.count(Tag.VENUS, 'raw')).to.eq(0);
    expect(tags.count(Tag.WILD, 'raw')).to.eq(0);
  });
});
