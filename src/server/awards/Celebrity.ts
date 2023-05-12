import {IAward} from './IAward';
import {Player} from '../Player';
import {CardType} from '../../common/cards/CardType';

export class Celebrity implements IAward {
  public readonly name = 'Celebrity';
  public readonly description = 'Play the most cards with a base cost of at least 20 M€ (not events.)';
  public getScore(player: Player): number {
    return player.playedCards
      .filter((card) => (card.cost >= 20) && (card.type === CardType.ACTIVE || card.type === CardType.AUTOMATED)).length;
  }
}
