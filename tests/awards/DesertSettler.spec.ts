import {expect} from 'chai';
import {testGame} from '@tests/TestGame';
import {BoardName} from '@/common/boards/BoardName';
import {TileType} from '@/common/TileType';
import {DesertSettler} from '@/server/awards/DesertSettler';
import {TestPlayer} from '@tests/TestPlayer';

describe('DesertSettler', () => {
  function getSpaceForRow(player: TestPlayer, row: number) {
    return player.game.board.getAvailableSpacesOnLand(player)
      .filter((s) => s.y === row)[0];
  }
  it('counts rows on Tharsis', () => {
    const [game, player] = testGame(2, {boardName: BoardName.THARSIS});
    const ma = new DesertSettler();

    const greenery = {tileType: TileType.GREENERY};

    game.simpleAddTile(player, getSpaceForRow(player, 0), greenery);
    expect(ma.getScore(player)).eq(0);

    game.simpleAddTile(player, getSpaceForRow(player, 1), greenery);
    expect(ma.getScore(player)).eq(0);

    game.simpleAddTile(player, getSpaceForRow(player, 2), greenery);
    expect(ma.getScore(player)).eq(0);

    game.simpleAddTile(player, getSpaceForRow(player, 3), greenery);
    expect(ma.getScore(player)).eq(0);

    game.simpleAddTile(player, getSpaceForRow(player, 4), greenery);
    expect(ma.getScore(player)).eq(0);

    game.simpleAddTile(player, getSpaceForRow(player, 5), greenery);
    expect(ma.getScore(player)).eq(1);

    game.simpleAddTile(player, getSpaceForRow(player, 6), greenery);
    expect(ma.getScore(player)).eq(2);

    game.simpleAddTile(player, getSpaceForRow(player, 7), greenery);
    expect(ma.getScore(player)).eq(3);

    game.simpleAddTile(player, getSpaceForRow(player, 8), greenery);
    expect(ma.getScore(player)).eq(4);
  });

  it('counts rows on Amazonis Planitia', () => {
    const [game, player] = testGame(2, {boardName: BoardName.AMAZONIS_PLANITIA});
    const ma = new DesertSettler();

    const greenery = {tileType: TileType.GREENERY};

    game.simpleAddTile(player, getSpaceForRow(player, 0), greenery);
    expect(ma.getScore(player)).eq(0);

    game.simpleAddTile(player, getSpaceForRow(player, 1), greenery);
    expect(ma.getScore(player)).eq(0);

    game.simpleAddTile(player, getSpaceForRow(player, 2), greenery);
    expect(ma.getScore(player)).eq(0);

    game.simpleAddTile(player, getSpaceForRow(player, 3), greenery);
    expect(ma.getScore(player)).eq(0);

    game.simpleAddTile(player, getSpaceForRow(player, 4), greenery);
    expect(ma.getScore(player)).eq(0);

    game.simpleAddTile(player, getSpaceForRow(player, 5), greenery);
    expect(ma.getScore(player)).eq(0);

    game.simpleAddTile(player, getSpaceForRow(player, 6), greenery);
    expect(ma.getScore(player)).eq(1);

    game.simpleAddTile(player, getSpaceForRow(player, 7), greenery);
    expect(ma.getScore(player)).eq(2);

    game.simpleAddTile(player, getSpaceForRow(player, 8), greenery);
    expect(ma.getScore(player)).eq(3);

    game.simpleAddTile(player, getSpaceForRow(player, 9), greenery);
    expect(ma.getScore(player)).eq(4);

    game.simpleAddTile(player, getSpaceForRow(player, 10), greenery);
    expect(ma.getScore(player)).eq(5);
  });
});
