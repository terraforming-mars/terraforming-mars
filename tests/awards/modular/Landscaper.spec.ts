import {expect} from 'chai';
import {TestPlayer} from '../../TestPlayer';
import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {EmptyBoard} from '../../testing/EmptyBoard';
import {Landscaper} from '../../../src/server/awards/modular/Landscaper';
import {TileType} from '../../../src/common/TileType';
import {SpaceType} from '../../../src/common/boards/SpaceType';

describe('Landscaper Award with Board Setup', () => {
  let award: Landscaper;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    [game, player, player2] = testGame(2);
    game.board = EmptyBoard.newInstance(); // Assuming that will crease empty board
    award = new Landscaper();
  });

  it('Counts largest connected group of tiles', () => {
    const colonySpaces = game.board.getSpaces(SpaceType.COLONY, player);
    const landSpaces = game.board.getAvailableSpacesOnLand(player);

    game.simpleAddTile(player, landSpaces[0], {tileType: TileType.CITY});
    expect(award.getScore(player)).eq(1);

    game.simpleAddTile(player, landSpaces[2], {tileType: TileType.CITY});
    expect(award.getScore(player)).eq(1);

    game.simpleAddTile(player, landSpaces[3], {tileType: TileType.GREENERY});
    expect(award.getScore(player)).eq(2);

    game.simpleAddTile(player, landSpaces[1], {tileType: TileType.GREENERY});
    expect(award.getScore(player)).eq(4);

    game.simpleAddTile(player, colonySpaces[0], {tileType: TileType.CITY});
    expect(award.getScore(player)).eq(4);

    game.simpleAddTile(player2, landSpaces[6], {tileType: TileType.CITY});
    expect(award.getScore(player2)).eq(1);
  });
});
