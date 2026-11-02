import {BaseMilestone} from './IMilestone';
import {IPlayer} from '../IPlayer';

export class Specialist extends BaseMilestone {
  public readonly automaDescription = 'Any track ≥ 10';
  constructor() {
    super(
      'Specialist',
      'Have 10 in production of any resource',
      10);
  }
  public getScore(player: IPlayer): number {
    return Math.max(player.production.megacredits,
      player.production.steel,
      player.production.titanium,
      player.production.plants,
      player.production.energy,
      player.production.heat);
  }
}
