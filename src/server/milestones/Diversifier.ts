import {BaseMilestone} from './IMilestone';
import {Player} from '../Player';

export class Diversifier extends BaseMilestone {
  constructor() {
    super(
      'Diversifier',
      'Requires that you have 8 different tags in play',
      8);
  }
  public getScore(player: Player): number {
    return player.tags.distinctCount('milestone');
  }
}
