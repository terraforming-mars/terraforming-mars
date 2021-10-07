import {expect} from 'chai';
import {Game} from '../../src/Game';
import {LandSpecialist} from '../../src/milestones/LandSpecialist';
import {TestingUtils} from '../TestingUtils';
import {TestPlayers} from '../TestPlayers';
import {TestPlayer} from '../TestPlayer';
import {BoardName} from '../../src/boards/BoardName';
import {Board} from '../../src/boards/Board';
import {ISpace} from '../../src/boards/ISpace';
import {TileType} from '../../src/TileType';
import {MoonExpansion} from '../../src/moon/MoonExpansion';

describe('LandSpecialist', function() {
  let milestone : LandSpecialist;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;
  let board: Board;
  let spaces: Array<ISpace>;

  beforeEach(function() {
    milestone = new LandSpecialist();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('id', [player, player2], player, TestingUtils.setCustomGameOptions({boardName: BoardName.ARABIA_TERRA, moonExpansion: true}));
    board = game.board;
    spaces = board.getAvailableSpacesOnLand(player);
  });

  it('Can claim with 3 special tiles', () => {
    game.simpleAddTile(player, spaces[0], {tileType: TileType.ECOLOGICAL_ZONE});
    game.simpleAddTile(player, spaces[1], {tileType: TileType.CAPITAL});
    expect(milestone.canClaim(player)).is.false;

    game.simpleAddTile(player, spaces[2], {tileType: TileType.INDUSTRIAL_CENTER});
    expect(milestone.canClaim(player)).is.true;

    expect(milestone.canClaim(player2)).is.false;

    game.simpleAddTile(player2, spaces[3], {tileType: TileType.MINING_AREA});
    game.simpleAddTile(player2, spaces[4], {tileType: TileType.OCEAN_CITY});
    expect(milestone.canClaim(player2)).is.false;

    game.simpleAddTile(player2, spaces[5], {tileType: TileType.NATURAL_PRESERVE});
    expect(milestone.canClaim(player2)).is.true;
  });

  it('Cannot claim non-special tiles', () => {
    game.simpleAddTile(player, spaces[0], {tileType: TileType.CITY});
    game.simpleAddTile(player, spaces[1], {tileType: TileType.CITY});
    game.simpleAddTile(player, spaces[2], {tileType: TileType.GREENERY});
    expect(milestone.getScore(player)).eq(0);
    expect(milestone.canClaim(player)).is.false;
  });

  it('Can claim with special moon tiles', () => {
    const moonSpaces = MoonExpansion.moonData(game).moon.getAvailableSpacesOnLand(player);

    game.simpleAddTile(player, moonSpaces[0], {tileType: TileType.LUNA_MINING_HUB});
    game.simpleAddTile(player, moonSpaces[1], {tileType: TileType.LUNAR_MINE_URBANIZATION});
    game.simpleAddTile(player, moonSpaces[2], {tileType: TileType.LUNA_TRAIN_STATION});
    expect(milestone.getScore(player)).eq(3);
    expect(milestone.canClaim(player)).is.true;
  });

  it('Cannot claim with standard moon tiles', () => {
    const moonSpaces = MoonExpansion.moonData(game).moon.getAvailableSpacesOnLand(player);

    game.simpleAddTile(player, moonSpaces[0], {tileType: TileType.MOON_MINE});
    game.simpleAddTile(player, moonSpaces[1], {tileType: TileType.MOON_COLONY});
    game.simpleAddTile(player, moonSpaces[2], {tileType: TileType.MOON_ROAD});
    expect(milestone.getScore(player)).eq(0);
    expect(milestone.canClaim(player)).is.false;
  });

  it('Can claim with a mix of moon and mars special tiles', () => {
    const moonSpaces = MoonExpansion.moonData(game).moon.getAvailableSpacesOnLand(player);

    game.simpleAddTile(player, spaces[0], {tileType: TileType.ECOLOGICAL_ZONE});
    game.simpleAddTile(player, spaces[1], {tileType: TileType.CAPITAL});
    expect(milestone.getScore(player)).eq(2);

    game.simpleAddTile(player, moonSpaces[0], {tileType: TileType.LUNA_TRAIN_STATION});
    expect(milestone.getScore(player)).eq(3);
    expect(milestone.canClaim(player)).is.true;
  });
});
