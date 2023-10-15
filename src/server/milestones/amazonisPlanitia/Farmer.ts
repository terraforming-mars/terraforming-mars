import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';

export class Farmer extends BaseMilestone {
  constructor() {
    super(
      'Farmer',
      'Have 4 plant production',
      4);
  }

  public getScore(player: IPlayer): number {
    return player.production.plants;
  }
}
