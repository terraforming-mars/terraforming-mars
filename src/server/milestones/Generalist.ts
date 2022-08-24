import {IMilestone} from './IMilestone';
import {Player} from '../Player';

export class Generalist implements IMilestone {
  public name: string = 'Generalist';
  public description: string = 'Requires that you have increased all 6 productions by at least 1 step';
  public getScore(player: Player): number {
    let score: number = 0;
    const requiredProduction : number = player.game.gameOptions.corporateEra ? 0 : 1;

    if (player.production.megacredits > requiredProduction) score++;
    if (player.production.steel > requiredProduction) score++;
    if (player.production.titanium > requiredProduction) score++;
    if (player.production.plants > requiredProduction) score++;
    if (player.production.energy > requiredProduction) score++;
    if (player.production.heat > requiredProduction) score++;

    return score;
  }
  public canClaim(player: Player): boolean {
    return this.getScore(player) === 6;
  }
}
