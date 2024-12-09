import {IAward} from './IAward';
import {IPlayer} from '../IPlayer';
import {CardType} from '../../common/cards/CardType';

export class Forecaster implements IAward {
  public readonly name = 'Forecaster';
  public readonly description = 'Have the most cards with requirements in play';

  public getScore(player: IPlayer): number {
    const validCards = player.playedCards.filter((card) => {
      // TODO(kberg): Forecaster is not compatible with corps that turn events up (eg Odyssey)
      return card.type !== CardType.EVENT && card.requirements.length > 0;
    });

    return validCards.length;
  }
}
