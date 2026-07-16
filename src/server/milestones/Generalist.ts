import {BaseMilestone} from './IMilestone';
import {IPlayer} from '../IPlayer';

export class Generalist extends BaseMilestone {
  constructor() {
    super(
      'Generalist',
      'Have increased all 6 productions by 1 step',
      6);
  }

  public getScore(player: IPlayer): number {
    let score = 0;
    const requiredProduction = player.game.gameOptions.corporateEra ? 0 : 1;

    if (player.production.megacredits > requiredProduction) score++;
    if (player.production.steel > requiredProduction) score++;
    if (player.production.titanium > requiredProduction) score++;
    if (player.production.plants > requiredProduction) score++;
    if (player.production.energy > requiredProduction) score++;
    if (player.production.heat > requiredProduction) score++;

    return score;
  }
}
