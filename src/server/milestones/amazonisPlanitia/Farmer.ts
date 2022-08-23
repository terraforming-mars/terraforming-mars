import {Player} from '../../Player';
import {IMilestone} from '../IMilestone';

export class Farmer implements IMilestone {
  public name: string = 'Farmer';
  public description: string = 'Have 4 plant production';

  public getScore(player: Player): number {
    return player.production.plants;
  }

  public canClaim(player: Player): boolean {
    return this.getScore(player) >= 4;
  }
}
