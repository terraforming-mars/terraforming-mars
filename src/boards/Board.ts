import {ISpace} from './ISpace';
import {Player} from '../Player';
import {PlayerId, SpaceId} from '../common/Types';
import {SpaceType} from '../common/boards/SpaceType';
import {BASE_OCEAN_TILES as UNCOVERED_OCEAN_TILES, CITY_TILES, GREENERY_TILES, OCEAN_TILES, OCEAN_UPGRADE_TILES, TileType} from '../common/TileType';
import {AresHandler} from '../ares/AresHandler';
import {SerializedBoard, SerializedSpace} from './SerializedBoard';
import {SpaceName} from '../SpaceName';

/**
 * A representation of any hex board. This is normally Mars (Tharsis, Hellas, Elysium) but can also be The Moon.
 *
 * It also includes additional spaces, known as Colonies, that are not adjacent to other spaces.
 */
export abstract class Board {
  private maxX: number = 0;
  private maxY: number = 0;

  // stores adjacent spaces in clockwise order starting from the top left
  private readonly adjacentSpaces = new Map<SpaceId, Array<ISpace>>();

  protected constructor(public spaces: Array<ISpace>) {
    this.maxX = Math.max(...spaces.map((s) => s.x));
    this.maxY = Math.max(...spaces.map((s) => s.y));
    spaces.forEach((space) => {
      this.adjacentSpaces.set(space.id, this.computeAdjacentSpaces(space));
    });
  }

  public abstract getVolcanicSpaceIds(): Array<string>;

  public abstract getNoctisCitySpaceIds(): Array<string>;

  /* Returns the space given a Space ID. */
  public getSpace(id: string): ISpace {
    const space = this.spaces.find((space) => space.id === id);
    if (space === undefined) {
      throw new Error(`Can't find space with id ${id}`);
    }
    return space;
  }

  protected computeAdjacentSpaces(space: ISpace): Array<ISpace> {
    // Expects an odd number of rows. If a funny shape appears, it can be addressed.
    const middleRow = this.maxY / 2;
    if (space.spaceType !== SpaceType.COLONY) {
      if (space.y < 0 || space.y > this.maxY) {
        throw new Error('Unexpected space y value: ' + space.y);
      }
      if (space.x < 0 || space.x > this.maxX) {
        throw new Error('Unexpected space x value: ' + space.x);
      }
      const leftSpace: Array<number> = [space.x - 1, space.y];
      const rightSpace: Array<number> = [space.x + 1, space.y];
      const topLeftSpace: Array<number> = [space.x, space.y - 1];
      const topRightSpace: Array<number> = [space.x, space.y - 1];
      const bottomLeftSpace: Array<number> = [space.x, space.y + 1];
      const bottomRightSpace: Array<number> = [space.x, space.y + 1];
      if (space.y < middleRow) {
        bottomLeftSpace[0]--;
        topRightSpace[0]++;
      } else if (space.y === middleRow) {
        bottomRightSpace[0]++;
        topRightSpace[0]++;
      } else {
        bottomRightSpace[0]++;
        topLeftSpace[0]--;
      }
      // Coordinates are in clockwise order. Order only ever matters during solo game set-up when
      // placing starting forests. Since that is the only case where ordering matters, it is
      // adopted here.
      const coords = [
        topLeftSpace,
        topRightSpace,
        rightSpace,
        bottomRightSpace,
        bottomLeftSpace,
        leftSpace,
      ];
      const spaces: Array<ISpace> = [];
      for (const [x, y] of coords) {
        const adj = this.spaces.find((adj) =>
          space !== adj && adj.spaceType !== SpaceType.COLONY &&
            adj.x === x && adj.y === y,
        );
        if (adj !== undefined) {
          spaces.push(adj);
        }
      }
      return spaces;
    }
    return [];
  }

  // Returns adjacent spaces in clockwise order starting from the top left.
  public getAdjacentSpaces(space: ISpace): Array<ISpace> {
    const spaces = this.adjacentSpaces.get(space.id);
    if (spaces === undefined) {
      throw new Error(`Unexpected space ID ${space.id}`);
    }
    // Clone so that callers can't mutate our arrays
    return [...spaces];
  }

  public getSpaceByTileCard(cardName: string): ISpace | undefined {
    return this.spaces.find(
      (space) => space.tile !== undefined && space.tile.card === cardName,
    );
  }

  /*
   * Returns the number of oceans on the board.
   *
   * The default condition is to return those oceans used to count toward the global parameter, so
   * upgraded oceans are included, but Wetlands is not. That's why the boolean values have different defaults.
   */
  public getOceanCount(include?: {upgradedOceans?: boolean, wetlands?: boolean}): number {
    return this.getOceanSpaces(include).length;
  }

  /*
   * Returns spaces on the board with ocean tiless.
   *
   * The default condition is to return those oceans used to count toward the global parameter, so
   * upgraded oceans are included, but Wetlands is not. That's why the boolean values have different defaults.
   */
  public getOceanSpaces(include?: {upgradedOceans?: boolean, wetlands?: boolean}): Array<ISpace> {
    const spaces = this.spaces.filter((space) => {
      if (!Board.isOceanSpace(space)) return false;
      if (space.tile?.tileType === undefined) return false;
      const tileType = space.tile.tileType;
      if (OCEAN_UPGRADE_TILES.has(tileType)) {
        return include?.upgradedOceans ?? true;
      }
      if (tileType === TileType.WETLANDS) {
        return include?.wetlands ?? false;
      }
      return true;
    });
    return spaces;
  }

  public getSpaces(spaceType: SpaceType, _player : Player): Array<ISpace> {
    return this.spaces.filter((space) => space.spaceType === spaceType);
  }

  public getEmptySpaces(): Array<ISpace> {
    return this.spaces.filter((space) => space.tile === undefined);
  }

  public getAvailableSpacesForCity(player: Player): Array<ISpace> {
    // A city cannot be adjacent to another city
    return this.getAvailableSpacesOnLand(player).filter(
      (space) => this.getAdjacentSpaces(space).some((adjacentSpace) => Board.isCitySpace(adjacentSpace)) === false,
    );
  }

  public getAvailableSpacesForMarker(player: Player): Array<ISpace> {
    const spaces = this.getAvailableSpacesOnLand(player)
      .filter(
        (space) => this.getAdjacentSpaces(space).find(
          (adj) => adj.player === player,
        ) !== undefined,
      );
      // Remove duplicates
    return spaces.filter((space, index) => spaces.indexOf(space) === index);
  }

  public getAvailableSpacesForGreenery(player: Player): Array<ISpace> {
    let spacesOnLand = this.getAvailableSpacesOnLand(player);
    // Spaces next to Red City are always unavialable.
    if (player.game.gameOptions.pathfindersExpansion === true) {
      spacesOnLand = spacesOnLand.filter((space) => {
        return !this.getAdjacentSpaces(space).some((neighbor) => neighbor.tile?.tileType === TileType.RED_CITY);
      });
    }

    const spacesForGreenery = spacesOnLand
      .filter((space) => this.getAdjacentSpaces(space).find((adj) => adj.tile !== undefined && adj.player === player && adj.tile.tileType !== TileType.OCEAN) !== undefined);

    // Spaces next to tiles you own
    if (spacesForGreenery.length > 0) {
      return spacesForGreenery;
    }
    // Place anywhere if no space owned
    return spacesOnLand;
  }

  public getAvailableSpacesForOcean(player: Player): Array<ISpace> {
    return this.getSpaces(SpaceType.OCEAN, player)
      .filter(
        (space) => space.tile === undefined &&
                      (space.player === undefined || space.player === player),
      );
  }

  public getAvailableSpacesOnLand(player: Player): Array<ISpace> {
    const landSpaces = this.getSpaces(SpaceType.LAND, player).filter((space) => {
      const hasPlayerMarker = space.player !== undefined;
      // A space is available if it doesn't have a player marker on it or it belongs to |player|
      const safeForPlayer = !hasPlayerMarker || space.player === player;
      // And also, if it doesn't have a tile. Unless it's a hazard tile.
      const playableSpace = space.tile === undefined || AresHandler.hasHazardTile(space);
      // If it does have a hazard tile, make sure it's not a protected one.
      const blockedByDesperateMeasures = space.tile?.protectedHazard === true;
      return safeForPlayer && playableSpace && !blockedByDesperateMeasures;
    });

    return landSpaces;
  }

  // |distance| represents the number of eligible spaces from the top left (or bottom right)
  // to count. So distance 0 means the first available space.
  // If |direction| is 1, count from the top left. If -1, count from the other end of the map.
  // |player| will be an additional space filter (which basically supports Land Claim)
  // |predicate| allows callers to provide additional filtering of eligible spaces.
  public getNthAvailableLandSpace(
    distance: number,
    direction: -1 | 1,
    player: Player | undefined = undefined,
    predicate: (value: ISpace) => boolean = (_x) => true) {
    const spaces = this.spaces.filter((space) => {
      return this.canPlaceTile(space) && (space.player === undefined || space.player === player);
    }).filter(predicate);
    let idx = (direction === 1) ? distance : (spaces.length - (distance + 1));
    if (spaces.length === 0) {
      throw new Error('no spaces available');
    }
    while (idx < 0) {
      idx += spaces.length;
    }
    while (idx >= spaces.length) {
      idx -= spaces.length;
    }
    return spaces[idx];
  }

  public getNonReservedLandSpaces(): Array<ISpace> {
    return this.spaces.filter((space) => {
      return (space.spaceType === SpaceType.LAND || space.spaceType === SpaceType.COVE) &&
        (space.tile === undefined || AresHandler.hasHazardTile(space)) &&
        space.player === undefined;
    });
  }

  public canPlaceTile(space: ISpace): boolean {
    return space.tile === undefined && space.spaceType === SpaceType.LAND;
  }

  public static isCitySpace(space: ISpace): boolean {
    return space.tile !== undefined && CITY_TILES.has(space.tile.tileType);
  }

  // Returns true when the space has an ocean tile or any derivative tiles (ocean city, wetlands)
  public static isOceanSpace(space: ISpace): boolean {
    return space.tile !== undefined && OCEAN_TILES.has(space.tile.tileType);
  }

  // Returns true when the space is an ocean tile that is not used to cover another ocean.
  // Used for benefits associated with "when a player places an ocean tile"
  public static isUncoveredOceanSpace(space: ISpace): boolean {
    return space.tile !== undefined && UNCOVERED_OCEAN_TILES.has(space.tile.tileType);
  }

  public static isGreenerySpace(space: ISpace): boolean {
    return space.tile !== undefined && GREENERY_TILES.has(space.tile.tileType);
  }

  public static ownedBy(player: Player): (space: ISpace) => boolean {
    return (space: ISpace) => space.player?.id === player.id;
  }

  public static spaceOwnedBy(space: ISpace, player: Player): boolean {
    return Board.ownedBy(player)(space);
  }

  public serialize(): SerializedBoard {
    return {
      spaces: this.spaces.map((space) => {
        return {
          id: space.id,
          spaceType: space.spaceType,
          tile: space.tile,
          player: space.player?.id,
          bonus: space.bonus,
          adjacency: space.adjacency,
          x: space.x,
          y: space.y,
        };
      }),
    };
  }

  public static deserializeSpace(serialized: SerializedSpace, players: Array<Player>): ISpace {
    const playerId: PlayerId | undefined = serialized.player;
    const player = players.find((p) => p.id === playerId);
    const space: ISpace = {
      id: serialized.id,
      spaceType: serialized.spaceType,
      bonus: serialized.bonus,
      x: serialized.x,
      y: serialized.y,
    };

    // Patch for games with a broken spacetype for noctis city.
    // TODO(kberg): Remove this patch by 2022-04-01
    // See https://github.com/terraforming-mars/terraforming-mars/issues/4056
    if (serialized.spaceType === undefined) {
      console.log(`Undefined space type for ${space.id}`);
      if (space.id === SpaceName.NOCTIS_CITY) {
        space.spaceType = SpaceType.LAND;
      }
    }

    if (serialized.tile !== undefined) {
      space.tile = serialized.tile;
    }
    if (player !== undefined) {
      space.player = player;
    }
    if (serialized.adjacency !== undefined) {
      space.adjacency = serialized.adjacency;
    }

    return space;
  }

  public static deserializeSpaces(spaces: Array<SerializedSpace>, players: Array<Player>): Array<ISpace> {
    return spaces.map((space) => Board.deserializeSpace(space, players));
  }
}

export function nextToNoOtherTileFn(board: Board): (space: ISpace) => boolean {
  return (space: ISpace) => board.getAdjacentSpaces(space).every((space) => space.tile === undefined);
}

export function playerTileFn(player: Player) {
  return (space: ISpace) => space.player?.id === player.id;
}

export function isSpecialTile(space: ISpace): boolean {
  switch (space.tile?.tileType) {
  case TileType.GREENERY:
  case TileType.OCEAN:
  case TileType.CITY:
  case TileType.MOON_COLONY:
  case TileType.MOON_MINE:
  case TileType.MOON_ROAD:
  case undefined:
    return false;
  default:
    return true;
  }
}
