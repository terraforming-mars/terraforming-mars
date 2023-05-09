import {BaseMilestone} from './IMilestone';
import {Player} from '../Player';

export class Diversifier extends BaseMilestone {
  constructor() {
    super(
      'Diversifier',
      'Have 8 different tags',
      8);
  }
  public getScore(player: Player): number {
    return player.tags.distinctCount('milestone');
  }
}
