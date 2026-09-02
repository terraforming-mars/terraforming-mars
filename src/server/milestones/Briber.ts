import {IMilestone} from './IMilestone';
import {IPlayer} from '../IPlayer';

export class Briber implements IMilestone {
  public readonly name = 'Briber';
  public readonly description = 'Pay 12 M€ to receive this milestone, in addition to the normal claim cost';
  public getScore(player: IPlayer): number {
    return player.spendableMegacredits();
  }
  public canClaim(player: IPlayer): boolean {
    return player.canAfford(player.milestoneCost() + 12);
  }
}
