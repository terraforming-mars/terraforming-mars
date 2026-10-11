import {Space} from './Space';
import {CanAffordOptions, IPlayer} from '../IPlayer';
import {PlayerId, SpaceId} from '../../common/Types';
import {SpaceType} from '../../common/boards/SpaceType';
import {SpaceBonus} from '../../common/boards/SpaceBonus';
import {BASE_OCEAN_TILES, CITY_TILES, GREENERY_TILES, HAZARD_TILES, OCEAN_TILES, TileType} from '../../common/TileType';
import {SerializedBoard, SerializedSpace} from './SerializedBoard';
import {CardName} from '../../common/cards/CardName';
import {AresHandler} from '../ares/AresHandler';
import {AresProductionCost, EMPTY_ARES_PRODUCTION_COST} from '../ares/AdjacencyCost';
import {TR_SOURCES, TRSource} from '../../common/cards/TRSource';
import {LEGACY_CUBE_TILES} from '@/common/boards/SpaceCube';

/**
 * The bonus costs to place a tile on a space. For instance, spending 6MC to place an ocean,
 * or spending production to cover an Ares hazard.
 */
export type SpaceCosts = {
  megacredits: number,
  production: AresProductionCost,
  tr: TRSource,
};

/**
 * A representation of any hex board. This is normally Mars (Tharsis, Hellas, Elysium) but can also be The Moon.
 *
 * It also includes additional spaces, known as Colonies, that are not adjacent to other spaces.
 */
export abstract class Board {
  private maxX: number = 0;
  private maxY: number = 0;
  private map: Map<SpaceId, Space> = new Map();
  public volcanicSpaceIds: ReadonlyArray<SpaceId>;

  // stores adjacent spaces in clockwise order starting from the top left
  private readonly adjacentSpaces = new Map<SpaceId, ReadonlyArray<Space>>();

  public constructor(
    public readonly spaces: ReadonlyArray<Space>,
    public readonly noctisCitySpaceId?: SpaceId | undefined) {
    this.maxX = Math.max(...spaces.map((s) => s.x));
    this.maxY = Math.max(...spaces.map((s) => s.y));
    spaces.forEach((space) => {
      const adjacentSpaces = this.computeAdjacentSpaces(space);
      const filtered = adjacentSpaces.filter((space) => space !== undefined);
      this.adjacentSpaces.set(space.id, filtered);
      this.map.set(space.id, space);
    });

    this.volcanicSpaceIds = this.spaces.filter((space) => space.volcanic).map((space) => space.id);
  }

  /* Returns the space given a Space ID. */
  public getSpaceOrThrow(id: SpaceId): Space {
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
    return this.spaces.find((space) => space.tile?.card === cardName);
  }

  public getSpaces(spaceType: SpaceType): ReadonlyArray<Space> {
    return this.spaces.filter((space) => space.spaceType === spaceType);
  }

  /**
   * Update `costs` with any costs for this `space`.
   *
   * @returns `true` when costs has changed, `false` when it has not.
   */
  protected spaceCosts(_space: Space): SpaceCosts {
    return {megacredits: 0, production: {...EMPTY_ARES_PRODUCTION_COST}, tr: {}};
  }

  private computeAdditionalCosts(player: IPlayer, space: Space, multiplier: number | undefined, subjectToHazardAdjacency: boolean): SpaceCosts {
    const costs: SpaceCosts = this.spaceCosts(space);
    if (multiplier !== undefined) {
      costs.megacredits *= multiplier;
      for (const key of TR_SOURCES) {
        const val = costs.tr[key];
        if (val !== undefined) {
          costs.tr[key] = val * multiplier;
        }
      }
    }

    if (player.game.gameOptions.aresExtension === false) {
      return costs;
    }

    const aresCosts = AresHandler.computePlacementCosts(player, this, space, subjectToHazardAdjacency);
    costs.megacredits += aresCosts.megacredits;
    if (aresCosts.tr > 0) {
      costs.tr.tr = (costs.tr.tr ?? 0) + aresCosts.tr;
    }
    costs.production = aresCosts.production;
    return costs;
  }

  /**
   * Returns true when `player` can pay the additional costs of placing a tile on `space`.
   *
   * `subjectToHazardAdjacency` is false for ocean tiles, which don't pay Ares hazard production costs.
   */
  public canAfford(player: IPlayer, space: Space, canAffordOptions?: CanAffordOptions, subjectToHazardAdjacency: boolean = true) {
    const additionalCosts = this.computeAdditionalCosts(player, space, canAffordOptions?.bonusMultiplier, subjectToHazardAdjacency);
    if (additionalCosts.megacredits > 0) {
      const plan: CanAffordOptions = canAffordOptions !== undefined ? {...canAffordOptions} : {cost: 0, tr: {}};
      plan.cost += additionalCosts.megacredits;
      plan.tr = additionalCosts.tr;

      if (space.undergroundResources === 'place6mc') {
        plan.cost -= 6;
      }

      const afford = player.canAfford(plan);
      if (afford === false) {
        return false;
      }
    }
    return AresHandler.canPayProduction(player, additionalCosts.production);
  }

  public getAvailableSpacesOnLand(player: IPlayer, canAffordOptions?: CanAffordOptions, subjectToHazardAdjacency: boolean = true): ReadonlyArray<Space> {
    // Does this also apply to cove spaces?
    const landSpaces = this.getSpaces(SpaceType.LAND).filter((space) => {
      // A space is available if it doesn't have a player marker on it, or it belongs to |player|
      if (space.player !== undefined && space.player !== player) {
        return false;
      }

      if (space.id === this.noctisCitySpaceId) {
        return false;
      }

      if (space.cube !== undefined) {
        return false;
      }

      const playableSpace = space.tile === undefined || (AresHandler.hasHazardTile(space) && space.tile?.protectedHazard !== true);

      if (!playableSpace) {
        return false;
      }

      if (space.id === player.game.nomadSpace) {
        return false;
      }

      return this.canAfford(player, space, canAffordOptions, subjectToHazardAdjacency);
    });
    return landSpaces;
  }

  // |distance| represents the number of eligible spaces from the top left (or bottom right)
  // to count. So distance 0 means the first available space.
  // |direction| describes whether counting starts from the top left or bottom right.
  // |predicate| allows callers to provide additional filtering of eligible spaces.
  public getNthAvailableLandSpace(
    distance: number,
    direction: 'top' | 'bottom',
    predicate: (value: Space) => boolean = (_x) => true): Space {
    const spaces = this.spaces.filter((space) => {
      return this.canPlaceTile(space) && space.player === undefined;
    }).filter(predicate);
    if (spaces.length === 0) {
      throw new Error('no spaces available');
    }
    let idx = (direction === 'top') ? distance : (spaces.length - (distance + 1));
    while (idx < 0) {
      idx += spaces.length;
    }
    while (idx >= spaces.length) {
      idx -= spaces.length;
    }
    return spaces[idx];
  }

  /**
   * Return the number of empty areas adjacent to `player`'s tiles.
   *
   * An area is empty when nothing real stands on it: a hazard tile counts as empty.
   */
  public getAdjacentEmptySpacesCount(player: IPlayer): number {
    return this.spaces.filter((space) => {
      if (space.spaceType === SpaceType.COLONY) {
        return false;
      }
      if (space.spaceType === SpaceType.RESTRICTED) {
        return false;
      }
      if (Board.hasRealTile(space)) {
        return false;
      }
      return this.getAdjacentSpaces(space).some((adj) => {
        return Board.hasRealTile(adj) && adj.player === player;
      });
    }).length;
  }

  public canPlaceTile(space: Space): boolean {
    return space.spaceType === SpaceType.LAND &&
      space.tile === undefined &&
      space.id !== this.noctisCitySpaceId &&
      space.cube === undefined;
  }

  public static isCitySpace(space: Space): boolean {
    return space.tile !== undefined && CITY_TILES.has(space.tile.tileType);
  }

  // Returns true when the space has an ocean tile or any derivative tiles (ocean city, wetlands)
  public static isOceanSpace(space: Space): boolean {
    return space.tile !== undefined && OCEAN_TILES.has(space.tile.tileType);
  }

  /**
   *  Returns true when the space is an ocean tile that is not used to cover another ocean.
   *
   * Used for benefits associated with "when a player places an ocean tile"
   */
  public static isUncoveredOceanSpace(space: Space): boolean {
    return space.tile !== undefined && BASE_OCEAN_TILES.has(space.tile.tileType);
  }

  public static isGreenerySpace(space: Space): boolean {
    return space.tile !== undefined && GREENERY_TILES.has(space.tile.tileType);
  }

  public static ownedBy(player: IPlayer): (space: Space) => boolean {
    return (space: Space) => space.player?.id === player.id || space.coOwner?.id === player.id;
  }

  public static spaceOwnedBy(space: Space, player: IPlayer): boolean {
    return Board.ownedBy(player)(space);
  }

  public getHazards(): ReadonlyArray<Space> {
    return this.spaces.filter(AresHandler.hasHazardTile);
  }

  public getUnprotectedHazards(): ReadonlyArray<Space> {
    return this.getHazards().filter((space) => space.tile?.protectedHazard !== true);
  }

  /** Hazard tiles don't really count as tiles. */
  public static hasRealTile(space: Space) {
    return space.tile !== undefined && HAZARD_TILES.has(space.tile.tileType) === false;
  }

  public serialize(): SerializedBoard {
    return {
      spaces: this.spaces.map((space) => {
        const serialized: SerializedSpace = {
          id: space.id,
          spaceType: space.spaceType,
          tile: space.tile,
          player: space.player?.id,
          bonus: space.bonus,
          adjacency: space.adjacency,
          x: space.x,
          y: space.y,
        };
        if (space.cube !== undefined) {
          serialized.cube = space.cube;
        }
        if (space.undergroundResources !== undefined) {
          serialized.undergroundResources = space.undergroundResources;
        }
        if (space.excavator !== undefined) {
          serialized.excavator = space.excavator.id;
        }
        if (space.coOwner !== undefined) {
          serialized.coOwner = space.coOwner.id;
        }
        if (space.volcanic) {
          serialized.volcanic = true;
        }
        if (space.edge) {
          serialized.edge = true;
        }
        return serialized;
      }),
    };
  }

  private static findPlayer(players: ReadonlyArray<IPlayer>, playerId: PlayerId | undefined) {
    return players.find((p) => p.id === playerId);
  }

  public static deserializeSpace(serialized: SerializedSpace, players: ReadonlyArray<IPlayer>): Space {
    const player = this.findPlayer(players, serialized.player);
    const excavator = this.findPlayer(players, serialized.excavator);
    const coOwner = this.findPlayer(players, serialized.coOwner);
    const space: Space = {
      id: serialized.id,
      spaceType: serialized.spaceType,
      // TODO(kberg): Remove after 2026-12-01
      // _TEMPERATURE_3MC was merged into TEMPERATURE_4MC.
      bonus: serialized.bonus.map((b) => b === SpaceBonus._TEMPERATURE_3MC ? SpaceBonus.TEMPERATURE_4MC : b),
      edge: serialized.edge ?? false,
      x: serialized.x,
      y: serialized.y,
    };

    if (serialized.cube !== undefined) {
      space.cube = serialized.cube;
    }
    if (serialized.tile !== undefined) {
      const legacyCube = LEGACY_CUBE_TILES.get(serialized.tile.tileType);
      if (legacyCube) {
        space.cube = legacyCube;
      } else {
        space.tile = serialized.tile;
      }
    }
    if (player !== undefined) {
      space.player = player;
    }
    if (serialized.adjacency !== undefined) {
      space.adjacency = serialized.adjacency;
    }
    if (serialized.undergroundResources !== undefined) {
      space.undergroundResources = serialized.undergroundResources;
    }
    if (excavator !== undefined) {
      space.excavator = excavator;
    }
    if (coOwner !== undefined) {
      space.coOwner = coOwner;
    }
    if (serialized.volcanic !== undefined) {
      space.volcanic = serialized.volcanic;
    }
    return space;
  }

  public static deserialize(board: SerializedBoard, players: ReadonlyArray<IPlayer>): {spaces: Array<Space>} {
    const spaces = board.spaces.map((space) => Board.deserializeSpace(space, players));
    return {spaces};
  }
}

export function isSpecialTile(tileType: TileType | undefined): boolean {
  switch (tileType) {
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
  case TileType._DEPRECATED_REY_SKYWALKER:
  case TileType._DEPRECATED_MARTIAN_NATURE_WONDERS:
  case undefined:
    return false;
  default:
    return true;
  }
}

export function isSpecialTileSpace(space: Space): boolean {
  return isSpecialTile(space.tile?.tileType);
}
