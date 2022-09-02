import {Player} from '../../Player';
import {IMilestone} from '../IMilestone';

export class Gambler implements IMilestone {
  public readonly name = 'Gambler';
  public readonly description = 'Fund at least 2 awards';

  public getScore(player: Player): number {
    return player.game.fundedAwards.filter((award) => award.player === player).length;
  }

  public canClaim(player: Player): boolean {
    return this.getScore(player) >= 2;
  }
}
