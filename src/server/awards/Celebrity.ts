import {IAward} from './IAward';
import {IPlayer} from '../IPlayer';
import {CardType} from '../../common/cards/CardType';
import {IMarsBot} from '../automa/MarsBotCorpTypes';

export class Celebrity implements IAward {
  public readonly name = 'Celebrity';
  public readonly description = 'Have the most project cards in play with a base cost of at least 20 M€ (not events.)';
  public getScore(player: IPlayer): number {
    return player.playedCards.projects().filter((card) => {
      return (card.cost >= 20) && (card.type === CardType.ACTIVE || card.type === CardType.AUTOMATED);
    }).length;
  }

  /** MarsBot counts its own played pile, events included. */
  public marsBotScore(bot: IMarsBot): number {
    return bot.playedProjectCards.filter((card) => card.cost >= 20).length;
  }
}
