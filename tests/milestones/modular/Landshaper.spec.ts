import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {Landshaper} from '../../../src/server/milestones/modular/Landshaper';
import {TestPlayer} from '../../TestPlayer';
import {IGame} from '../../../src/server/IGame';
import {Space} from '../../../src/server/boards/Space';
import {TileType} from '../../../src/common/TileType';
import {BoardName} from '../../../src/common/boards/BoardName';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';

describe('Landshaper', () => {
  let milestone: Landshaper;
  let player: TestPlayer;
  let game: IGame;
  let spaces: ReadonlyArray<Space>;

  beforeEach(() => {
    milestone = new Landshaper();
    [game, player] = testGame(2, {boardName: BoardName.ARABIA_TERRA, moonExpansion: true});
    spaces = game.board.getAvailableSpacesOnLand(player);
  });

  it('Can claim with 1 city, 1 greenery, and 1 special tile', () => {
    game.simpleAddTile(player, spaces[0], {tileType: TileType.CITY});
    game.simpleAddTile(player, spaces[1], {tileType: TileType.GREENERY});
    game.simpleAddTile(player, spaces[2], {tileType: TileType.ECOLOGICAL_ZONE});
    expect(milestone.getScore(player)).eq(3);
    expect(milestone.canClaim(player)).is.true;
  });

  it('Cannot claim with only city and greenery', () => {
    game.simpleAddTile(player, spaces[0], {tileType: TileType.CITY});
    game.simpleAddTile(player, spaces[1], {tileType: TileType.GREENERY});
    game.simpleAddTile(player, spaces[2], {tileType: TileType.GREENERY});
    expect(milestone.getScore(player)).eq(2);
    expect(milestone.canClaim(player)).is.false;
  });

  it('Cannot claim with only city and special tile', () => {
    game.simpleAddTile(player, spaces[0], {tileType: TileType.CITY});
    game.simpleAddTile(player, spaces[1], {tileType: TileType.ECOLOGICAL_ZONE});
    expect(milestone.getScore(player)).eq(2);
    expect(milestone.canClaim(player)).is.false;
  });

  it('Cannot claim with only greenery and special tile', () => {
    game.simpleAddTile(player, spaces[0], {tileType: TileType.GREENERY});
    game.simpleAddTile(player, spaces[1], {tileType: TileType.ECOLOGICAL_ZONE});
    expect(milestone.getScore(player)).eq(2);
    expect(milestone.canClaim(player)).is.false;
  });

  it('Can claim with multiple of each required tile type', () => {
    game.simpleAddTile(player, spaces[0], {tileType: TileType.CITY});
    game.simpleAddTile(player, spaces[1], {tileType: TileType.CITY});
    game.simpleAddTile(player, spaces[2], {tileType: TileType.GREENERY});
    game.simpleAddTile(player, spaces[3], {tileType: TileType.GREENERY});
    game.simpleAddTile(player, spaces[4], {tileType: TileType.ECOLOGICAL_ZONE});
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

  it('Can claim with moon special tilee', () => {
    const moonSpaces = MoonExpansion.moonData(game).moon.getAvailableSpacesOnLand(player);
    game.simpleAddTile(player, spaces[0], {tileType: TileType.CITY});
    game.simpleAddTile(player, spaces[1], {tileType: TileType.GREENERY});
    game.simpleAddTile(player, moonSpaces[0], {tileType: TileType.LUNA_TRAIN_STATION});
    expect(milestone.canClaim(player)).to.be.true;
  });
});
