import {BaseMilestone} from './IMilestone';
import {Player} from '../Player';

export class Energizer extends BaseMilestone {
  constructor() {
    super(
      'Energizer',
      'Have 6 energy production',
      6);
  }
  public getScore(player: Player): number {
    return player.production.energy;
  }
}
