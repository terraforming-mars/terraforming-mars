import {IAward} from './IAward';
import {IPlayer} from '../IPlayer';
import {CardType} from '../../common/cards/CardType';

export class Adapter implements IAward {
  public readonly name = 'Adapter';
  public readonly description = 'Play the most cards with requirements';

  public getScore(player: IPlayer): number {
    const validCards = player.playedCards.filter((card) => {
      const isValidCardType = card.type !== CardType.EVENT;
      const hasRequirements = card.requirements !== undefined;

      return isValidCardType && hasRequirements;
    });

    return validCards.length;
  }
}
