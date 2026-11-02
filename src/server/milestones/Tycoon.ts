import {BaseMilestone} from './IMilestone';
import {IPlayer} from '../IPlayer';
import {CardType} from '../../common/cards/CardType';

export class Tycoon extends BaseMilestone {
  public readonly automaDescription = '15+ blue/green cards in played pile';
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
