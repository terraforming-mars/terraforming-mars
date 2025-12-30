import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';
import {CardType} from '../../../common/cards/CardType';

export class Tycoon10 extends BaseMilestone {
  constructor() {
    super(
      'Tycoon',
      'Have 10 blue and green cards in play.',
      10);
  }
  public getScore(player: IPlayer): number {
    return player.playedCards
      .filter((card) => card.type === CardType.ACTIVE || card.type === CardType.AUTOMATED).length;
  }
}
