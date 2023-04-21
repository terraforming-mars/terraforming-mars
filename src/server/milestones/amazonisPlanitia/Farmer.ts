import {Player} from '../../Player';
import {BaseMilestone} from '../IMilestone';

export class Farmer extends BaseMilestone {
  constructor() {
    super(
      'Farmer',
      'Have 4 plant production',
      4);
  }

  public getScore(player: Player): number {
    return player.production.plants;
  }
}
