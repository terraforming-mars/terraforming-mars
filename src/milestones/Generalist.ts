import {IMilestone} from './IMilestone';
import {Player} from '../Player';
import {Resources} from '../Resources';
import {Game} from '../Game';

export class Generalist implements IMilestone {
    public name: string = 'Generalist';
    public description: string = 'Requires that you have increased all 6 productions by at least 1 step'
    public getScore(player: Player, game: Game): number {
      let score: number = 0;
      const requiredProduction : number = game.gameOptions.corporateEra ? 0 : 1;

      if (player.getProduction(Resources.MEGACREDITS) > requiredProduction) score++;
      if (player.getProduction(Resources.STEEL) > requiredProduction) score++;
      if (player.getProduction(Resources.TITANIUM) > requiredProduction) score++;
      if (player.getProduction(Resources.PLANTS) > requiredProduction) score++;
      if (player.getProduction(Resources.ENERGY) > requiredProduction) score++;
      if (player.getProduction(Resources.HEAT) > requiredProduction) score++;

      return score;
    }
    public canClaim(player: Player, game: Game): boolean {
      return this.getScore(player, game) === 6;
    }
}
