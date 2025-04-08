import {BaseMilestone} from './IMilestone';
import {IPlayer} from '../IPlayer';

export class Metallurgist extends BaseMilestone {
  constructor() {
    super(
      'Metallurgist',
      'Have 6 steel production and titanium production combined',
      6);
  }
  public getScore(player: IPlayer): number {
    return player.production.steel + player.production.titanium;
  }
}
