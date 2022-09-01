import {Player} from '../../Player';
import {IMilestone} from '../IMilestone';

export class Colonizer implements IMilestone {
  public readonly name = 'Colonizer';
  public readonly description = 'Have 4 colonies built';

  public getScore(player: Player): number {
    return player.getColoniesCount();
  }

  public canClaim(player: Player): boolean {
    return this.getScore(player) >= 4;
  }
}
