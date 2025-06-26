import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {TestPlayer} from '../../TestPlayer';
import {Board} from '../../../src/server/boards/Board';
import {TileType} from '../../../src/common/TileType';
import {testGame} from '../../TestGame';
import {Constructor} from '../../../src/server/awards/modular/Constructor';
import {Luna} from '../../../src/server/colonies/Luna';
import {Pluto} from '../../../src/server/colonies/Pluto';

describe('Constructor', () => {
  let award : Constructor;
  let player: TestPlayer;
  let game: IGame;
  let board: Board;

  beforeEach(() => {
    award = new Constructor();
    [game, player] = testGame(2, {coloniesExtension: true});
    board = game.board;
  });

  it('It is applied to all cities (on mars and not on mars) and colonies', () => {
    const colonySpaces = board.getSpaces(SpaceType.COLONY, player);
    const landSpaces = board.getAvailableSpacesOnLand(player);
    const colony1 = new Luna();
    const colony2 = new Pluto();

    game.simpleAddTile(player, landSpaces[0], {tileType: TileType.GREENERY});
    game.simpleAddTile(player, colonySpaces[0], {tileType: TileType.CITY});
    expect(award.getScore(player)).eq(1);

    game.simpleAddTile(player, landSpaces[1], {tileType: TileType.CITY});
    expect(award.getScore(player)).eq(2);

    game.simpleAddTile(player, landSpaces[3], {tileType: TileType.CAPITAL});
    expect(award.getScore(player)).eq(3);

    colony1.colonies.push(player.id);
    game.colonies.push(colony1);
    expect(award.getScore(player)).eq(4);

    colony2.colonies.push(player.id);
    game.colonies.push(colony2);
    expect(award.getScore(player)).eq(5);
  });
});
