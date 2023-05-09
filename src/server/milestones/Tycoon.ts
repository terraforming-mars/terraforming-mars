import {BaseMilestone} from './IMilestone';
import {Player} from '../Player';
import {CardType} from '../../common/cards/CardType';

export class Tycoon extends BaseMilestone {
  constructor() {
    super(
      'Tycoon',
      'Have 15 project cards (blue and green cards)',
      15);
  }
  public getScore(player: Player): number {
    return player.playedCards
      .filter((card) => card.type === CardType.ACTIVE || card.type === CardType.AUTOMATED).length;
  }
}
