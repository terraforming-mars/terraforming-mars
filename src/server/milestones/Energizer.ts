import {BaseMilestone} from './IMilestone';
import {IPlayer} from '../IPlayer';

export class Energizer extends BaseMilestone {
  constructor() {
    super(
      'Energizer',
      'Have 6 energy production',
      6);
  }
  public getScore(player: IPlayer): number {
    return player.production.energy;
  }
}
