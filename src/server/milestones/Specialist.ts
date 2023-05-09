import {BaseMilestone} from './IMilestone';
import {Player} from '../Player';

export class Specialist extends BaseMilestone {
  constructor() {
    super(
      'Specialist',
      'Have 10 in production of any resource',
      10);
  }
  public getScore(player: Player): number {
    return Math.max(player.production.megacredits,
      player.production.steel,
      player.production.titanium,
      player.production.plants,
      player.production.energy,
      player.production.heat);
  }
}
