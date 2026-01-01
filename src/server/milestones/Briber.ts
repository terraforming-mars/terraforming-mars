import {BaseMilestone} from './IMilestone';
import {IPlayer} from '../IPlayer';
import {CardName} from '../../common/cards/CardName';

export class Briber extends BaseMilestone {
  constructor() {
    super(
      'Briber',
      'Pay 12 M€ to receive this milestone, in addition to the normal claim cost',
      1);
  }
  public getScore(player: IPlayer): number {
    const baseCost = player.playedCards.has(CardName.VANALLEN) ? 0 : player.milestoneCost();
    return player.canAfford(baseCost + 12) ? 1 : 0;
  }
}
