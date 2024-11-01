import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';

export class ThermoEngineer extends BaseMilestone {
  constructor() {
    super(
      'ThermoEngineer',
      'Have a total of 10 energy and heat production',
      10);
  }

  public getScore(player: IPlayer): number {
    return player.production.energy + player.production.heat;
  }
}
