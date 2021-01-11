import {expect} from 'chai';
// import {Player} from '../../src/Player';
// import {TileType} from '../../src/TileType';
// import {ISpace} from '../../src/boards/ISpace';
import {SpaceType} from '../../src/SpaceType';
// import {TestPlayers} from '../TestingUtils';
import {MoonBoard} from '../../src/moon/MoonBoard';
// import {Color} from '../../src/Color';
// import {SerializedBoard} from '../../src/boards/SerializedBoard';

describe('MoonBoard', function() {
  let board : MoonBoard;
  // let player : Player; let player2 : Player;

  beforeEach(function() {
    board = MoonBoard.newInstance();
    // player = TestPlayers.BLUE.newPlayer();
    // player2 = TestPlayers.RED.newPlayer();
  });

  it('getSpace', () => {
    expect(() => board.getSpace('01').id).to.throw(Error, /Can't find space with id 01/);
    expect(board.getSpace('m01').spaceType).eq(SpaceType.COLONY);
    expect(board.getSpace('m01').id).eq('m01');
  });


  it('getAdjacentSpaces', () => {
    expect(board.getAdjacentSpaces(board.getSpace('m01'))).is.empty;
    expect(board.getAdjacentSpaces(board.getSpace('m02')).map((s) => s.id)).deep.eq(['m03', 'm05', 'm06']);
  });
});
