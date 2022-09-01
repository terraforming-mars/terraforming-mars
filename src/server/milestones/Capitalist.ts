import {IMilestone} from './IMilestone';
import {Player} from '../Player';

export class Capitalist implements IMilestone {
  public readonly name = 'Capitalist';
  public readonly description = 'Have at least 64 M€';

  public getScore(player: Player): number {
    return player.megaCredits;
  }

  public canClaim(player: Player): boolean {
    return this.getScore(player) >= 64;
  }
}
