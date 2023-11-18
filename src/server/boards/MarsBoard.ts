import {OCEAN_UPGRADE_TILES, TileType} from '../../common/TileType';
import {SpaceType} from '../../common/boards/SpaceType';
import {CanAffordOptions, IPlayer} from '../IPlayer';
import {Board} from './Board';
import {Space} from './Space';
import {PlacementType} from './PlacementType';
import {AresHandler} from '../ares/AresHandler';
import {CardName} from '../../common/cards/CardName';

export class MarsBoard extends Board {
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
    case 'isolated': return this.getAvailableIsolatedSpaces(player, canAffordOptions);
    case 'volcanic': return this.getAvailableVolcanicSpaces(player, canAffordOptions);
    case 'upgradeable-ocean': return this.getOceanSpaces({upgradedOceans: false});
    default: throw new Error('unknown type ' + type);
    }
  }

  /*
   * Returns spaces on the board with ocean tiless.
   *
   * The default condition is to return those oceans used to count toward the global parameter, so
   * upgraded oceans are included, but Wetlands is not. That's why the boolean values have different defaults.
   */
  public getOceanSpaces(include?: {upgradedOceans?: boolean, wetlands?: boolean}): ReadonlyArray<Space> {
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

  public getAvailableSpacesForCity(player: IPlayer, canAffordOptions?: CanAffordOptions): ReadonlyArray<Space> {
    const spacesOnLand = this.getAvailableSpacesOnLand(player, canAffordOptions);
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

  public getAvailableSpacesForGreenery(player: IPlayer, canAffordOptions?: CanAffordOptions): ReadonlyArray<Space> {
    let spacesOnLand = this.getAvailableSpacesOnLand(player, canAffordOptions);
    // Gordon CEO can ignore placement restrictions for Cities+Greenery
    if (player.cardIsInEffect(CardName.GORDON)) return spacesOnLand;
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

  public getAvailableSpacesForOcean(player: IPlayer): ReadonlyArray<Space> {
    return this.getSpaces(SpaceType.OCEAN, player)
      .filter(
        (space) => space.tile === undefined &&
                      (space.player === undefined || space.player === player),
      );
  }

  public getAvailableIsolatedSpaces(player: IPlayer, canAffordOptions?: CanAffordOptions): ReadonlyArray<Space> {
    return this.getAvailableSpacesOnLand(player, canAffordOptions)
      .filter((space: Space) => this.getAdjacentSpaces(space).every((space) => space.tile === undefined));
  }

  public getAvailableVolcanicSpaces(player: IPlayer, canAffordOptions?: CanAffordOptions): ReadonlyArray<Space> {
    const volcanicSpaceIds = this.getVolcanicSpaceIds();

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
      return (space.spaceType === SpaceType.LAND || space.spaceType === SpaceType.COVE) &&
        (space.tile === undefined || AresHandler.hasHazardTile(space)) &&
        space.player === undefined;
    });
  }
}
