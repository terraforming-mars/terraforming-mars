
import {IAward} from './IAward';
import {IPlayer} from '../IPlayer';
import {CardType} from '../../common/cards/CardType';
import {IMarsBot} from '@/server/automa/IMarsBot';

export class Magnate implements IAward {
  public readonly name = 'Magnate';
  public readonly description = 'Have the most automated (green) project cards in play';
  public readonly automaDescription = 'Green cards in played pile';
  public getScore(player: IPlayer): number {
    return player.playedCards
      .filter((card) => card.type === CardType.AUTOMATED).length;
  }

  /**
   * Counts the green cards in MarsBot's own played pile (rulebook C p.9).
   *
   * The expansion list's "blue and green" (rulebook C p.15) is a typo, per the designer in BGG
   * thread 3534424.
   */
  public marsBotScore(bot: IMarsBot): number {
    return bot.playedProjectCards.filter((card) => card.type === CardType.AUTOMATED).length;
  }
}
