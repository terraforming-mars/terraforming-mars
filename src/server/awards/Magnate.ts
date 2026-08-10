
import {IAward} from './IAward';
import {IPlayer} from '../IPlayer';
import {CardType} from '../../common/cards/CardType';
import {IMarsBot} from '../automa/MarsBotCorpTypes';

export class Magnate implements IAward {
  public readonly name = 'Magnate';
  public readonly description = 'Have the most automated (green) project cards in play';
  public getScore(player: IPlayer): number {
    return player.playedCards
      .filter((card) => card.type === CardType.AUTOMATED).length;
  }

  /** MarsBot counts the green cards in its own played pile. */
  public marsBotScore(bot: IMarsBot): number {
    return bot.playedProjectCards.filter((card) => card.type === CardType.AUTOMATED).length;
  }
}
