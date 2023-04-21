import {BaseMilestone} from './IMilestone';
import {Player} from '../Player';

export class Energizer extends BaseMilestone {
  constructor() {
    super(
      'Energizer',
      'Requires that you have 6 energy production',
      6);
  }
  public getScore(player: Player): number {
    return player.production.energy;
  }
}
