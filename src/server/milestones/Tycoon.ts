import {BaseMilestone} from '@/server/milestones/IMilestone';
import {IPlayer} from '@/server/IPlayer';
import {CardType} from '@/common/cards/CardType';

export class Tycoon extends BaseMilestone {
  constructor() {
    super(
      'Tycoon',
      'Have 15 project cards in play (not events.)',
      15);
  }
  public getScore(player: IPlayer): number {
    return player.playedCards
      .filter((card) => card.type === CardType.ACTIVE || card.type === CardType.AUTOMATED).length;
  }
}
