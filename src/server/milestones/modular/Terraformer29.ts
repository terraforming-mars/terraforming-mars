import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';

export class Terraformer29 extends BaseMilestone {
  constructor() {
    super('Terraformer29', 'Have a terraform rating of 29', 29);
  }
  public getScore(player: IPlayer): number {
    return player.terraformRating;
  }
}
