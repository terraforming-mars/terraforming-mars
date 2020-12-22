import {ISpace} from '../ISpace';
import {Player} from '../Player';
import {SpaceType} from '../SpaceType';
import {SpaceName} from '../SpaceName';
import {SpaceBonus} from '../SpaceBonus';
import {TileType} from '../TileType';
import {AresHandler} from '../ares/AresHandler';

export abstract class Space implements ISpace {
  constructor(public id: string, public spaceType: SpaceType, public bonus: Array<SpaceBonus>, public x: number, public y: number ) {

  }
}

export class BoardColony extends Space {
  constructor(id: string) {
    super(id, SpaceType.COLONY, [], -1, -1);
  }
}

export class Land extends Space {
  constructor(id: number, x: number, y: number, bonus: Array<SpaceBonus> = []) {
    let str_id = id.toString();
    if (id < 10) {
      str_id = '0'+str_id;
    }
    super(str_id, SpaceType.LAND, bonus, x, y);
  }
}

export class Ocean extends Space {
  constructor(id: number, x: number, y: number, bonus: Array<SpaceBonus> = []) {
    let str_id = id.toString();
    if (id < 10) {
      str_id = '0'+str_id;
    }
    super(str_id, SpaceType.OCEAN, bonus, x, y);
  }
}

export abstract class Board {
    public spaces: Array<ISpace> = [];
    public getAdjacentSpaces(space: ISpace): Array<ISpace> {
      if (space.spaceType !== SpaceType.COLONY) {
        if (space.y < 0 || space.y > 8) {
          throw new Error('Unexpected space y value');
        }
        if (space.x < 0 || space.x > 8) {
          throw new Error('Unexpected space x value');
        }
        const leftSpace: Array<number> = [space.x - 1, space.y];
        const rightSpace: Array<number> = [space.x + 1, space.y];
        const topLeftSpace: Array<number> = [space.x, space.y - 1];
        const topRightSpace: Array<number> = [space.x, space.y - 1];
        const bottomLeftSpace: Array<number> = [space.x, space.y + 1];
        const bottomRightSpace: Array<number> = [space.x, space.y + 1];
        if (space.y < 4) {
          bottomLeftSpace[0]--;
          topRightSpace[0]++;
        } else if (space.y === 4) {
          bottomRightSpace[0]++;
          topRightSpace[0]++;
        } else {
          bottomRightSpace[0]++;
          topLeftSpace[0]--;
        }
        return this.spaces.filter((adj) => {
          return space !== adj && adj.spaceType !== SpaceType.COLONY && (
            (adj.x === leftSpace[0] && adj.y === leftSpace[1]) ||
            (adj.x === rightSpace[0] && adj.y === rightSpace[1]) ||
            (adj.x === topLeftSpace[0] && adj.y === topLeftSpace[1]) ||
            (adj.x === topRightSpace[0] && adj.y === topRightSpace[1]) ||
            (adj.x === bottomLeftSpace[0] && adj.y === bottomLeftSpace[1]) ||
            (adj.x === bottomRightSpace[0] && adj.y === bottomRightSpace[1])
          );
        });
      }
      return [];
    }

    public getSpaceByTileCard(cardName: string): ISpace | undefined {
      return this.spaces.find(
        (space) => space.tile !== undefined && space.tile.card === cardName,
      );
    }

    public getOceansOnBoard(countUpgradedOceans: boolean = true): number {
      return this.getOceansTiles(countUpgradedOceans).length;
    }

    public getOceansTiles(countUpgradedOceans: boolean): Array<ISpace> {
      if (!countUpgradedOceans) {
        return this.spaces.filter((space) => space.tile !== undefined &&
                        space.tile.tileType === TileType.OCEAN,
        );
      } else {
        return this.spaces.filter((space) => Board.isOceanSpace(space));
      }
    }

    public getSpaces(spaceType: SpaceType, _player?: Player): Array<ISpace> {
      return this.spaces.filter((space) => space.spaceType === spaceType);
    }

    public getEmptySpaces(): Array<ISpace> {
      return this.spaces.filter((space) => space.tile === undefined);
    }

    public getAvailableSpacesForCity(player: Player): Array<ISpace> {
      // A city cannot be adjacent to another city
      return this.getAvailableSpacesOnLand(player).filter(
        (space) => this.getAdjacentSpaces(space).filter((adjacentSpace) => Board.isCitySpace(adjacentSpace)).length === 0,
      );
    }

    public getAvailableSpacesForMarker(player: Player): Array<ISpace> {
      const spaces = this.getAvailableSpacesOnLand(player)
        .filter(
          (space) => this.getAdjacentSpaces(space).find(
            (adj) => adj.player === player.id,
          ) !== undefined,
        );
        // Remove duplicates
      return spaces.filter((space, index) => spaces.indexOf(space) === index);
    }

    public getAvailableSpacesForGreenery(player: Player): Array<ISpace> {
      const spacesForGreenery = this.getAvailableSpacesOnLand(player)
        .filter((space) => this.getAdjacentSpaces(space).find((adj) => adj.tile !== undefined && adj.player === player.id && adj.tile.tileType !== TileType.OCEAN) !== undefined);

      // Spaces next to tiles you own
      if (spacesForGreenery.length > 0) {
        return spacesForGreenery;
      }
      // Place anywhere if no space owned
      return this.getAvailableSpacesOnLand(player);
    }

    public getAvailableSpacesForOcean(player: Player): Array<ISpace> {
      return this.getSpaces(SpaceType.OCEAN, player)
        .filter(
          (space) => space.tile === undefined &&
                        (space.player === undefined || space.player === player.id),
        );
    }

    public getAvailableSpacesOnLand(player?: Player): Array<ISpace> {
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

    protected shuffle(input: Array<ISpace>): Array<ISpace> {
      const out: Array<ISpace> = [];
      const copy = input.slice();
      while (copy.length) {
        out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
      }
      return out;
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
        return this.canPlaceTile(space) && (space.player === undefined || space.player === player?.id);
      }).filter(predicate);
      let idx = (direction === 1) ? distance : (spaces.length - (distance + 1));
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
        return space.spaceType === SpaceType.LAND && (
          space.tile === undefined ||
            AresHandler.hasHazardTile(space)
        ) && space.player === undefined &&
             space.id !== SpaceName.NOCTIS_CITY;
      });
    }

    public canPlaceTile(space: ISpace): boolean {
      return space !== undefined && space.tile === undefined && space instanceof Land;
    }

    public getForestSpace(spaces: Array<ISpace>): ISpace {
      const space = this.shuffle(spaces).find((s) => this.canPlaceTile(s));
      if (space === undefined) {
        throw new Error('Did not find space for forest');
      }
      return space;
    }

    public static isCitySpace(space: ISpace): boolean {
      const cityTileTypes = [TileType.CITY, TileType.CAPITAL, TileType.OCEAN_CITY];
      return space.tile !== undefined && cityTileTypes.includes(space.tile.tileType);
    }

    public static isOceanSpace(space: ISpace): boolean {
      const oceanTileTypes = [TileType.OCEAN, TileType.OCEAN_CITY, TileType.OCEAN_FARM, TileType.OCEAN_SANCTUARY];
      return space.tile !== undefined && oceanTileTypes.includes(space.tile.tileType);
    }
}
