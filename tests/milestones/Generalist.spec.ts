import {expect} from 'chai';
import {Generalist} from '../../src/server/milestones/Generalist';
import {ALL_RESOURCES} from '../../src/common/Resource';
import {testGame} from '../TestingUtils';
import {IMarsBot} from '../../src/server/automa/MarsBotCorpTypes';
import {MarsBotBoard} from '../../src/server/automa/MarsBotBoard';
import {THARSIS_MARSBOT_BOARD} from '../../src/server/automa/boards/TharsisMarsBot';
import {VENUS_MARSBOT_TRACK} from '../../src/server/automa/boards/VenusMarsBot';

describe('Generalist', () => {
  let milestone: Generalist;

  beforeEach(() => {
    milestone = new Generalist();
  });

  it('Can claim with +1 of each production in game with corp era', () => {
    const [/* game */, player/* , player2 */] = testGame(2);
    ALL_RESOURCES.forEach((resource) => player.production.add(resource, 1));

    expect(milestone.canClaim(player)).is.true;
  });

  it('Cannot claim with +1 of each production in game without corp era', () => {
    const [/* game */, player/* , player2 */] = testGame(2, {corporateEra: false});

    ALL_RESOURCES.forEach((resource) => expect(player.production[resource]).to.eq(1));
    expect(milestone.canClaim(player)).is.not.true;
  });

  it('Can claim with +2 of each production in game without corp era', () => {
    const [/* game */, player/* , player2 */] = testGame(2, {corporateEra: false});
    ALL_RESOURCES.forEach((resource) => player.production.add(resource, 1));

    ALL_RESOURCES.forEach((resource) => expect(player.production[resource]).to.eq(2));
    expect(milestone.canClaim(player)).is.true;
  });

  it('MarsBot claims it with every Mars track at space 2, the Venus track aside', () => {
    const board = new MarsBotBoard([...THARSIS_MARSBOT_BOARD, VENUS_MARSBOT_TRACK]);
    const bot = {board} as unknown as IMarsBot;
    for (let index = 0; index < 6; index++) {
      board.tracks[index].advance();
      board.tracks[index].advance();
    }
    board.tracks[6].advance();
    expect(milestone.marsBotCanClaim(bot)).is.false;

    board.tracks[6].advance();
    expect(milestone.marsBotCanClaim(bot)).is.true;
    expect(board.tracks[7].position).to.eq(0);
  });
});
