import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {TestPlayer} from '../../TestPlayer';
import {Board} from '../../../src/server/boards/Board';
import {TileType} from '../../../src/common/TileType';
import {testGame} from '../../TestGame';
import {Metropolist} from '../../../src/server/awards/modular/Metropolist';

describe('Metropolist', () => {
  let award : Metropolist;
  let player: TestPlayer;
  let game: IGame;
  let board: Board;

  beforeEach(() => {
    award = new Metropolist();
    [game, player] = testGame(2);
    board = game.board;
  });

  it('Is applied to all cities', () => {
    const colonySpaces = board.getSpaces(SpaceType.COLONY, player);
    const landSpaces = board.getAvailableSpacesOnLand(player);

    game.simpleAddTile(player, landSpaces[0], {tileType: TileType.GREENERY});
    game.simpleAddTile(player, colonySpaces[0], {tileType: TileType.CITY});
    expect(award.getScore(player)).eq(1);

    game.simpleAddTile(player, landSpaces[1], {tileType: TileType.CITY});
    expect(award.getScore(player)).eq(2);

    game.simpleAddTile(player, landSpaces[2], {tileType: TileType.CITY});
    expect(award.getScore(player)).eq(3);

    game.simpleAddTile(player, landSpaces[3], {tileType: TileType.CAPITAL});
    expect(award.getScore(player)).eq(4);

    game.simpleAddTile(player, landSpaces[4], {tileType: TileType.OCEAN_CITY});
    expect(award.getScore(player)).eq(5);
  });
});
