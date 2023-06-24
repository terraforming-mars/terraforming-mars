import {TileType} from '../../common/TileType';
import {SpaceType} from '../../common/boards/SpaceType';
import {IPlayer} from '../IPlayer';
import {Board} from './Board';
import {ISpace} from './ISpace';

export class MarsBoard extends Board {
  public getCitiesOffMarsCount(player?: IPlayer): number {
    return this.getCitiesCount(player, (space) => space.spaceType === SpaceType.COLONY);
  }

  public getCitiesOnMarsCount(player?: IPlayer): number {
    return this.getCitiesCount(player, (space) => space.spaceType !== SpaceType.COLONY);
  }

  public getCitiesCount(player?: IPlayer, filter?: (space: ISpace) => boolean): number {
    let cities = this.spaces.filter(Board.isCitySpace);
    if (player !== undefined) cities = cities.filter(Board.ownedBy(player));
    if (filter) cities = cities.filter(filter);
    return cities.length;
  }

  public getGreeneriesCount(player?: IPlayer): number {
    let greeneries = this.spaces.filter((space) => Board.isGreenerySpace(space));
    if (player !== undefined) greeneries = greeneries.filter(Board.ownedBy(player));
    return greeneries.length;
  }

  public getSpaceCount(tileType: TileType, player: IPlayer): number {
    return this.spaces.filter(Board.ownedBy(player))
      .filter((space) => space.tile?.tileType === tileType)
      .length;
  }
}
