import {BaseMilestone} from './IMilestone';
import {IPlayer} from '../IPlayer';

export class Smith extends BaseMilestone {
  constructor() {
    super(
      'Smith',
      'Have a total of 7 steel and titanium production',
      7);
  }

  public getScore(player: IPlayer): number {
    return player.production.steel + player.production.titanium;
  }
}
