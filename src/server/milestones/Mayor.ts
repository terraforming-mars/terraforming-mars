import {BaseMilestone} from './IMilestone';
import {Player} from '../Player';

export class Mayor extends BaseMilestone {
  constructor() {
    super(
      'Mayor',
      'Own 3 city tiles',
      3);
  }
  public getScore(player: Player): number {
    return player.game.getCitiesCount(player);
  }
}
