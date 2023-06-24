import {SpaceType} from '../../common/boards/SpaceType';
import {IPlayer} from '../IPlayer';
import {Board} from './Board';
import {ISpace} from './ISpace';

export class MarsBoard extends Board {
  public getCitiesOffMars(player?: IPlayer): Array<ISpace> {
    return this.getCities(player).filter((space) => space.spaceType === SpaceType.COLONY);
  }

  public getCitiesOnMars(player?: IPlayer): Array<ISpace> {
    return this.getCities(player).filter((space) => space.spaceType !== SpaceType.COLONY);
  }

  public getCities(player?: IPlayer): Array<ISpace> {
    let cities = this.spaces.filter(Board.isCitySpace);
    if (player !== undefined) cities = cities.filter(Board.ownedBy(player));
    return cities;
  }

  public getGreeneries(player?: IPlayer): Array<ISpace> {
    let greeneries = this.spaces.filter((space) => Board.isGreenerySpace(space));
    if (player !== undefined) greeneries = greeneries.filter(Board.ownedBy(player));
    return greeneries;
  }
}
