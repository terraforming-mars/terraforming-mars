import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {EmptyBoard} from '../../testing/EmptyBoard';
import {Landscaper} from '../../../src/server/awards/modular/Landscaper';
import {TileType} from '../../../src/common/TileType';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';

describe('Landscaper Award with Board Setup', () => {
  it('Counts largest connected group of tiles', () => {
    const [game, player, player2] = testGame(2);
    game.board = EmptyBoard.newInstance(); // Assuming that will crease empty board
    const award = new Landscaper();

    const colonySpaces = game.board.getSpaces(SpaceType.COLONY);
    const landSpaces = game.board.getAvailableSpacesOnLand(player);

    expect(award.getScore(player)).eq(0);

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

  it('Does not count Land Claim', () => {
    const [game, player] = testGame(2);
    game.board = EmptyBoard.newInstance(); // Assuming that will crease empty board
    const award = new Landscaper();

    const landSpaces = game.board.getAvailableSpacesOnLand(player);

    game.simpleAddTile(player, landSpaces[2], {tileType: TileType.CITY});
    expect(award.getScore(player)).eq(1);

    game.simpleAddTile(player, landSpaces[3], {tileType: TileType.GREENERY});
    expect(award.getScore(player)).eq(2);

    landSpaces[3].tile = undefined;
    landSpaces[3].player = player;
    expect(award.getScore(player)).eq(1);
  });


  it('Works on The Moon', () => {
    const [game, player] = testGame(2, {moonExpansion: true});
    const moon = game.moonData!.moon;
    const award = new Landscaper();
    const moonSpaces = moon.getAvailableSpacesOnLand(player);

    expect(award.getScore(player)).eq(0);

    MoonExpansion.addHabitatTile(player, moonSpaces[0].id);
    expect(award.getScore(player)).eq(1);

    MoonExpansion.addMineTile(player, moonSpaces[2].id);
    expect(award.getScore(player)).eq(1);

    MoonExpansion.addRoadTile(player, moonSpaces[3].id);
    expect(award.getScore(player)).eq(2);
  });
});
