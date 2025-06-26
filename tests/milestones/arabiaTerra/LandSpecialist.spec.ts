import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {LandSpecialist} from '../../../src/server/milestones/arabiaTerra/LandSpecialist';
import {TestPlayer} from '../../TestPlayer';
import {BoardName} from '../../../src/common/boards/BoardName';
import {Board} from '../../../src/server/boards/Board';
import {Space} from '../../../src/server/boards/Space';
import {TileType} from '../../../src/common/TileType';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {testGame} from '../../TestingUtils';

describe('LandSpecialist', () => {
  let milestone: LandSpecialist;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;
  let board: Board;
  let spaces: ReadonlyArray<Space>;

  beforeEach(() => {
    milestone = new LandSpecialist();
    [game, player, player2] = testGame(2, {boardName: BoardName.ARABIA_TERRA, moonExpansion: true});
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
    game.simpleAddTile(player, spaces[3], {tileType: TileType.EROSION_MILD});
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
    game.simpleAddTile(player, moonSpaces[1], {tileType: TileType.MOON_HABITAT});
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
