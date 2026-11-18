import {IMilestone} from './IMilestone';
import {IPlayer} from '../IPlayer';
import {IMarsBot} from '@/server/automa/IMarsBot';

export class Briber implements IMilestone {
  public readonly name = 'Briber';
  public readonly description = 'Pay 12 M€ to receive this milestone, in addition to the normal claim cost';
  public readonly automaDescription = '20+ M€ (loses 12 M€ on claim)';
  public getScore(player: IPlayer): number {
    return player.spendableMegacredits();
  }
  public canClaim(player: IPlayer): boolean {
    return player.canAfford(player.milestoneCost() + 12);
  }

  /** MarsBot needs 20 M€ on hand, and claiming costs it 12 (rulebook C p.13). */
  public marsBotCanClaim(marsBot: IMarsBot): boolean {
    return marsBot.megacredits >= 20;
  }
}
