import {IAward} from '@/server/awards/IAward';
import {IPlayer} from '@/server/IPlayer';
import {CardType} from '@/common/cards/CardType';

export class Celebrity implements IAward {
  public readonly name = 'Celebrity';
  public readonly description = 'Have the most project cards in play with a base cost of at least 20 M€ (not events.)';
  public getScore(player: IPlayer): number {
    return player.playedCards.projects().filter((card) => {
      return (card.cost >= 20) && (card.type === CardType.ACTIVE || card.type === CardType.AUTOMATED);
    }).length;
  }
}
