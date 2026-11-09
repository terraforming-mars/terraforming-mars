import {IAward} from './IAward';
import {IPlayer} from '../IPlayer';
import {CardType} from '../../common/cards/CardType';
import {IMarsBot} from '@/server/automa/IMarsBot';

export class Celebrity implements IAward {
  public readonly name = 'Celebrity';
  public readonly description = 'Have the most project cards in play with a base cost of at least 20 M€ (not events.)';
  public readonly automaDescription = 'Cards costing 20+ M€ (including events)';
  public getScore(player: IPlayer): number {
    return player.playedCards.projects().filter((card) => {
      return (card.cost >= 20) && (card.type === CardType.ACTIVE || card.type === CardType.AUTOMATED);
    }).length;
  }

  /**
   * Counts the cards costing 20 M€ or more in MarsBot's played pile (rulebook C p.9 and p.14).
   *
   * Unlike a player's events, MarsBot's events count.
   */
  public marsBotScore(marsBot: IMarsBot): number {
    return marsBot.playedProjectCards.filter((card) => card.cost >= 20).length;
  }
}
