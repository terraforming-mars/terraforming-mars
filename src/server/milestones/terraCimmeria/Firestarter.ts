import {Player} from '../../Player';
import {IMilestone} from '../IMilestone';

export class Firestarter implements IMilestone {
  public name: string = 'Firestarter';
  public description: string = 'Have 20 heat';

  public getScore(player: Player): number {
    return player.heat;
  }

  public canClaim(player: Player): boolean {
    return this.getScore(player) >= 20;
  }
}
