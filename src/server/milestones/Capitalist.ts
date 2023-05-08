import {BaseMilestone} from './IMilestone';
import {Player} from '../Player';

export class Capitalist extends BaseMilestone {
  constructor() {
    super(
      'Capitalist',
      'Have 64 M€',
      64);
  }

  public getScore(player: Player): number {
    return player.megaCredits;
  }
}
