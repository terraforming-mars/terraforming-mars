import {OCEAN_UPGRADE_TILES, TileType} from '../../common/TileType';
import {SpaceType} from '../../common/boards/SpaceType';
import {CanAffordOptions, IPlayer} from '../IPlayer';
import {Board} from './Board';
import {Space} from './Space';
import {PlacementType} from './PlacementType';
import {AresHandler} from '../ares/AresHandler';
import {CardName} from '../../common/cards/CardName';
import {SpaceId} from '../../common/Types';
import {oneWayDifference} from '../../common/utils/utils';

export class MarsBoard extends Board {
  private readonly edges: ReadonlyArray<Space>;

  protected constructor(
    spaces: ReadonlyArray<Space>,
    noctisCitySpaceId: SpaceId | undefined,
    volcanicSpaceIds: ReadonlyArray<SpaceId>) {
    super(spaces, noctisCitySpaceId, volcanicSpaceIds);
    this.edges = this.computeEdges();
  }

  public getCitiesOffMars(player?: IPlayer): Array<Space> {
    return this.getCities(player).filter((space) => space.spaceType === SpaceType.COLONY);
  }

  public getCitiesOnMars(player?: IPlayer): Array<Space> {
    return this.getCities(player).filter((space) => space.spaceType !== SpaceType.COLONY);
  }

  public getCities(player?: IPlayer): Array<Space> {
    let cities = this.spaces.filter(Board.isCitySpace);
    if (player !== undefined) cities = cities.filter(Board.ownedBy(player));
    return cities;
  }

  public getGreeneries(player?: IPlayer): Array<Space> {
    let greeneries = this.spaces.filter((space) => Board.isGreenerySpace(space));
    if (player !== undefined) greeneries = greeneries.filter(Board.ownedBy(player));
    return greeneries;
  }

  public getAvailableSpacesForType(player: IPlayer, type: PlacementType, canAffordOptions?: CanAffordOptions | undefined): ReadonlyArray<Space> {
    switch (type) {
    case 'land': return this.getAvailableSpacesOnLand(player, canAffordOptions);
    case 'ocean': return this.getAvailableSpacesForOcean(player);
    case 'greenery': return this.getAvailableSpacesForGreenery(player, canAffordOptions);
    case 'city': return this.getAvailableSpacesForCity(player, canAffordOptions);
    case 'away-from-cities': return this.getSpacesAwayFromCities(player, canAffordOptions);
    case 'isolated': return this.getAvailableIsolatedSpaces(player, canAffordOptions);
    case 'volcanic': return this.getAvailableVolcanicSpaces(player, canAffordOptions);
    case 'upgradeable-ocean': return this.getOceanSpaces({upgradedOceans: false});
    case 'upgradeable-ocean-new-holland': {
      const oceanSpaces = this.getOceanSpaces({upgradedOceans: false});
      const filtered = this.getAvailableSpacesForCity(player, undefined, oceanSpaces);
      return filtered;
    }
    default: throw new Error('unknown type ' + type);
    }
  }

  /*
   * Returns spaces on the board with ocean tiless.
   *
   * The default condition is to return those oceans used to count toward the global parameter, so
   * upgraded oceans are included, but Wetlands is not. That's why the boolean values have different defaults.
   */
  public getOceanSpaces(include?: {upgradedOceans?: boolean, wetlands?: boolean, newHolland?: boolean}): ReadonlyArray<Space> {
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

  public getAvailableSpacesForCity(player: IPlayer, canAffordOptions?: CanAffordOptions, spaces?: ReadonlyArray<Space>): ReadonlyArray<Space> {
    const spacesOnLand = spaces ?? this.getAvailableSpacesOnLand(player, canAffordOptions);
    // Gordon CEO can ignore placement restrictions for Cities+Greenery
    if (player.cardIsInEffect(CardName.GORDON)) {
      return spacesOnLand;
    }
    // Kingdom of Tauraro can place cities next to cities, but also must place them
    // next to tiles they own, if possible.
    if (player.isCorporation(CardName.KINGDOM_OF_TAURARO)) {
      const spacesNextToMySpaces = spacesOnLand.filter(
        (space) => this.getAdjacentSpaces(space).some(
          (adj) => adj.tile !== undefined && adj.player === player));

      return (spacesNextToMySpaces.length > 0) ? spacesNextToMySpaces : spacesOnLand;
    }
    // A city cannot be adjacent to another city
    return spacesOnLand.filter(
      (space) => this.getAdjacentSpaces(space).some((adjacentSpace) => Board.isCitySpace(adjacentSpace)) === false,
    );
  }

  public getSpacesAwayFromCities(player: IPlayer, canAffordOptions?: CanAffordOptions): ReadonlyArray<Space> {
    const spacesOnLand = this.getAvailableSpacesOnLand(player, canAffordOptions);

    return spacesOnLand.filter(
      (space) => this.getAdjacentSpaces(space).some((adjacentSpace) => Board.isCitySpace(adjacentSpace)) === false,
    );
  }

  public filterSpacesAroundRedCity(spaces: ReadonlyArray<Space>): ReadonlyArray<Space> {
    const redCity = this.getSpaceByTileCard(CardName.RED_CITY);
    if (redCity === undefined) {
      return spaces;
    }
    const adjacentSpaces = this.getAdjacentSpaces(redCity);
    return oneWayDifference(spaces, adjacentSpaces);
  }

  public getAvailableSpacesForGreenery(player: IPlayer, canAffordOptions?: CanAffordOptions): ReadonlyArray<Space> {
    let availableLandSpaces = this.getAvailableSpacesOnLand(player, canAffordOptions);
    // Gordon CEO can ignore placement restrictions for Cities+Greenery
    if (player.cardIsInEffect(CardName.GORDON)) return availableLandSpaces;
    // Spaces next to Red City are always unavialable for Greeneries.
    availableLandSpaces = this.filterSpacesAroundRedCity(availableLandSpaces);

    // player can place a greenery in an available land space that is next
    // to a tile the player already owns.
    const spacesForGreenery = availableLandSpaces.filter((space) => {
      return this.getAdjacentSpaces(space).some((adj) => {
        return MarsBoard.hasRealTile(adj) && adj.player === player;
      });
    });

    // Spaces next to tiles you own
    if (spacesForGreenery.length > 0) {
      return spacesForGreenery;
    }
    // Place anywhere if no space owned
    return availableLandSpaces;
  }

  public getAvailableSpacesForOcean(player: IPlayer): ReadonlyArray<Space> {
    return this.getSpaces(SpaceType.OCEAN, player)
      .filter((space) => space.tile === undefined && (space.player === undefined || space.player === player));
  }

  private computeEdges(): ReadonlyArray<Space> {
    return this.spaces.filter((space) => {
      if (space.y === 0 || space.y === 8 || space.x === 8) {
        return true;
      }
      // left side is tricky.
      // top-left is easy with math. Look at the map.
      if (space.y + space.x === 4) {
        return true;
      }
      // bottom-left is also easy with math. Look at the map.
      if (space.y - space.x === 4) {
        return true;
      }
      return false;
    });
  }

  public getEdges(): ReadonlyArray<Space> {
    return this.edges;
  }

  public getAvailableIsolatedSpaces(player: IPlayer, canAffordOptions?: CanAffordOptions): ReadonlyArray<Space> {
    return this.getAvailableSpacesOnLand(player, canAffordOptions)
      .filter((space: Space) => this.getAdjacentSpaces(space).every((space) => space.tile === undefined));
  }

  public getAvailableVolcanicSpaces(player: IPlayer, canAffordOptions?: CanAffordOptions): ReadonlyArray<Space> {
    const volcanicSpaceIds = this.volcanicSpaceIds;

    const spaces = this.getAvailableSpacesOnLand(player, canAffordOptions);
    if (volcanicSpaceIds.length > 0) {
      return spaces.filter((space) => volcanicSpaceIds.includes(space.id));
    }
    return spaces;
  }

  /**
   * Almost the same as getAvailableSpacesOnLand, but doesn't apply to any player.
   */
  public getNonReservedLandSpaces(): ReadonlyArray<Space> {
    return this.spaces.filter((space) => {
      if (space.id === this.noctisCitySpaceId) {
        return false;
      }
      return (space.spaceType === SpaceType.LAND || space.spaceType === SpaceType.COVE) &&
        (space.tile === undefined || AresHandler.hasHazardTile(space)) &&
        space.player === undefined;
    });
  }
}
