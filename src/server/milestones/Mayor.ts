import {BaseMilestone} from './IMilestone';
import {IPlayer} from '../IPlayer';

export class Mayor extends BaseMilestone {
  constructor() {
    super(
      'Mayor',
      'Own 3 city tiles',
      3);
  }
  public getScore(player: IPlayer): number {
    return player.game.getCitiesCount(player);
  }
}
