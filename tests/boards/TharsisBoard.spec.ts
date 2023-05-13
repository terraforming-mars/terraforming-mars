import {DEFAULT_GAME_OPTIONS} from '../../src/server/GameOptions';
import {expect} from 'chai';
import {TharsisBoard} from '../../src/server/boards/TharsisBoard';
import {SeededRandom} from '../../src/server/Random';
import {SpaceType} from '../../src/common/boards/SpaceType';
import {SpaceId} from '../../src/common/Types';

describe('TharsisBoard', function() {
  it('has error with input while calling getAdjacentSpaces', function() {
    const board = TharsisBoard.newInstance(DEFAULT_GAME_OPTIONS, new SeededRandom(0));
    expect(function() {
      board.getAdjacentSpaces({
        x: 0,
        y: 0,
        bonus: [],
        id: 'foobar' as SpaceId,
        spaceType: SpaceType.LAND,
      });
    }).to.throw('Unexpected space ID foobar');
  });
});
