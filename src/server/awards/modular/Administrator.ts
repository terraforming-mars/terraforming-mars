import {IPlayer} from '../../IPlayer';
import {IAward} from '../IAward';
import {CardType} from '@/common/cards/CardType';
import {IMarsBot} from '@/server/automa/IMarsBot';

export class Administrator implements IAward {
  public readonly name = 'Administrator';
  public readonly description = 'Have the most cards with no tags';
  public readonly automaDescription = 'Cards without tags in played pile + 2';

  public getScore(player: IPlayer): number {
    return player.tags.numberOfCardsWithNoTags();
  }

  /**
   * Counts the cards without tags in MarsBot's own played pile, plus 2 (rulebook C p.14).
   *
   * Events don't count, the same as for the human player.
   */
  public marsBotScore(bot: IMarsBot): number {
    return bot.playedProjectCards.filter((card) => card.type !== CardType.EVENT && card.tags.length === 0).length + 2;
  }
}
