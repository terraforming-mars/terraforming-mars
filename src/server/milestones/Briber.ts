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

  /**
   * MarsBot needs 20 M€ on hand (rulebook C p.13).
   *
   * Claiming it also costs MarsBot 12 of them, which is paid with the claim, not here.
   */
  public marsBotCanClaim(bot: IMarsBot): boolean {
    return bot.megacredits >= 20;
  }
}
