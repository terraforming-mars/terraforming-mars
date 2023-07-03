import {Space} from './Space';
import {IPlayer} from '../IPlayer';
import {PlayerId, SpaceId} from '../../common/Types';
import {SpaceType} from '../../common/boards/SpaceType';
import {BASE_OCEAN_TILES as UNCOVERED_OCEAN_TILES, CITY_TILES, GREENERY_TILES, OCEAN_TILES, TileType} from '../../common/TileType';
import {SerializedBoard, SerializedSpace} from './SerializedBoard';
import {CardName} from '../../common/cards/CardName';
import {SpaceBonus} from '../../common/boards/SpaceBonus';
import {AresHandler} from '../ares/AresHandler';

/**
 * A representation of any hex board. This is normally Mars (Tharsis, Hellas, Elysium) but can also be The Moon.
 *
 * It also includes additional spaces, known as Colonies, that are not adjacent to other spaces.
 */
export abstract class Board {
  private maxX: number = 0;
  private maxY: number = 0;
  private map: Map<SpaceId, Space> = new Map();

  // stores adjacent spaces in clockwise order starting from the top left
  private readonly adjacentSpaces = new Map<SpaceId, ReadonlyArray<Space>>();

  protected constructor(public spaces: ReadonlyArray<Space>) {
    this.maxX = Math.max(...spaces.map((s) => s.x));
    this.maxY = Math.max(...spaces.map((s) => s.y));
    spaces.forEach((space) => {
      const adjacentSpaces = this.computeAdjacentSpaces(space);
      const filtered = adjacentSpaces.filter((space) => space !== undefined);
      // "as ReadonlyArray<Space> is OK because the line above filters out the undefined values."
      this.adjacentSpaces.set(space.id, filtered as ReadonlyArray<Space>);
      this.map.set(space.id, space);
    });
  }

  public getVolcanicSpaceIds(): ReadonlyArray<SpaceId> {
    return [];
  }

  public getNoctisCitySpaceId(): SpaceId | undefined {
    return undefined;
  }

  /* Returns the space given a Space ID. */
  public getSpace(id: SpaceId): Space {
    const space = this.map.get(id);
    if (space === undefined) {
      throw new Error(`Can't find space with id ${id}`);
    }
    return space;
  }

  protected computeAdjacentSpaces(space: Space): ReadonlyArray<Space | undefined> {
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
      const spaces = coords.map(([x, y]) =>
        this.spaces.find((adj) =>
          adj.x === x && adj.y === y &&
          space !== adj && adj.spaceType !== SpaceType.COLONY,
        ));
      return spaces;
    }
    return [];
  }

  // Returns adjacent spaces in clockwise order starting from the top left.
  public getAdjacentSpaces(space: Space): ReadonlyArray<Space> {
    const spaces = this.adjacentSpaces.get(space.id);
    if (spaces === undefined) {
      throw new Error(`Unexpected space ID ${space.id}`);
    }
    return spaces;
  }

  //  Returns spaces in order from the top left.
  //
  //   0 1
  //  5 x 2
  //   4 3
  //
  // If there is no space in that spot, the index is undefined.
  // If the space is invalid or is a colony, this returns an unreliable value.
  public getAdjacentSpacesClockwise(space: Space): ReadonlyArray<Space | undefined> {
    return this.computeAdjacentSpaces(space);
  }

  public getSpaceByTileCard(cardName: CardName): Space | undefined {
    return this.spaces.find(
      (space) => space.tile !== undefined && space.tile.card === cardName,
    );
  }

  public getSpaces(spaceType: SpaceType, _player: IPlayer): ReadonlyArray<Space> {
    return this.spaces.filter((space) => space.spaceType === spaceType);
  }

  public getEmptySpaces(): ReadonlyArray<Space> {
    return this.spaces.filter((space) => space.tile === undefined);
  }

  public getAvailableSpacesOnLand(player: IPlayer): ReadonlyArray<Space> {
    const landSpaces = this.getSpaces(SpaceType.LAND, player).filter((space) => {
      const hasPlayerMarker = space.player !== undefined;
      // A space is available if it doesn't have a player marker on it or it belongs to |player|
      const safeForPlayer = !hasPlayerMarker || space.player === player;
      // And also, if it doesn't have a tile. Unless it's a hazard tile.
      const playableSpace = space.tile === undefined || AresHandler.hasHazardTile(space);
      // If it does have a hazard tile, make sure it's not a protected one.
      const blockedByDesperateMeasures = space.tile?.protectedHazard === true;
      // tiles are not placeable on restricted spaces at all
      const isRestricted = space.bonus.includes(SpaceBonus.RESTRICTED);
      return !isRestricted && safeForPlayer && playableSpace && !blockedByDesperateMeasures;
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
    player: IPlayer | undefined = undefined,
    predicate: (value: Space) => boolean = (_x) => true): Space {
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

  public canPlaceTile(space: Space): boolean {
    return space.tile === undefined && space.spaceType === SpaceType.LAND && space.bonus.includes(SpaceBonus.RESTRICTED) === false;
  }

  public static isCitySpace(space: Space): boolean {
    return space.tile !== undefined && CITY_TILES.has(space.tile.tileType);
  }

  // Returns true when the space has an ocean tile or any derivative tiles (ocean city, wetlands)
  public static isOceanSpace(space: Space): boolean {
    return space.tile !== undefined && OCEAN_TILES.has(space.tile.tileType);
  }

  // Returns true when the space is an ocean tile that is not used to cover another ocean.
  // Used for benefits associated with "when a player places an ocean tile"
  public static isUncoveredOceanSpace(space: Space): boolean {
    return space.tile !== undefined && UNCOVERED_OCEAN_TILES.has(space.tile.tileType);
  }

  public static isGreenerySpace(space: Space): boolean {
    return space.tile !== undefined && GREENERY_TILES.has(space.tile.tileType);
  }

  public static ownedBy(player: IPlayer): (space: Space) => boolean {
    return (space: Space) => space.player?.id === player.id;
  }

  public static spaceOwnedBy(space: Space, player: IPlayer): boolean {
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

  public static deserializeSpace(serialized: SerializedSpace, players: ReadonlyArray<IPlayer>): Space {
    const playerId: PlayerId | undefined = serialized.player;
    const player = players.find((p) => p.id === playerId);
    const space: Space = {
      id: serialized.id,
      spaceType: serialized.spaceType,
      bonus: serialized.bonus,
      x: serialized.x,
      y: serialized.y,
    };

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

  public static deserializeSpaces(spaces: ReadonlyArray<SerializedSpace>, players: ReadonlyArray<IPlayer>): Array<Space> {
    return spaces.map((space) => Board.deserializeSpace(space, players));
  }
}

export function playerTileFn(player: IPlayer) {
  return (space: Space) => space.player?.id === player.id;
}

export function isSpecialTile(space: Space): boolean {
  switch (space.tile?.tileType) {
  case TileType.GREENERY:
  case TileType.OCEAN:
  case TileType.CITY:
  case TileType.MOON_HABITAT:
  case TileType.MOON_MINE:
  case TileType.MOON_ROAD:
  case TileType.EROSION_MILD: // Hazard tiles are "special" but they don't count for the typical intent of what a special tile represents.
  case TileType.EROSION_SEVERE:
  case TileType.DUST_STORM_MILD:
  case TileType.DUST_STORM_SEVERE:
  case undefined:
    return false;
  default:
    return true;
  }
}
