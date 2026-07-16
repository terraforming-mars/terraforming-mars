import {IMilestone} from './IMilestone';
import {IPlayer} from '../IPlayer';
import {CardName} from '../../common/cards/CardName';

export class Briber implements IMilestone {
  public readonly name = 'Briber';
  public readonly description = 'Pay 12 M€ to receive this milestone, in addition to the normal claim cost';
  public getScore(player: IPlayer): number {
    return player.spendableMegacredits();
  }
  public canClaim(player: IPlayer): boolean {
    const baseCost = player.playedCards.has(CardName.VANALLEN) ? 0 : player.milestoneCost();
    return player.canAfford(baseCost + 12);
  }
}
