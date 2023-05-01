import {BaseMilestone} from './IMilestone';
import {Player} from '../Player';

export class Gardener extends BaseMilestone {
  constructor() {
    super(
      'Gardener',
      'Own 3 greenery tiles',
      3);
  }
  public getScore(player: Player): number {
    return player.game.getGreeneriesCount(player);
  }
}
