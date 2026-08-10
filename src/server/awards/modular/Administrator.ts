import {IPlayer} from '../../IPlayer';
import {IAward} from '../IAward';
import {IMarsBot} from '../../automa/MarsBotCorpTypes';

export class Administrator implements IAward {
  public readonly name = 'Administrator';
  public readonly description = 'Have the most cards with no tags';

  public getScore(player: IPlayer): number {
    return player.tags.numberOfCardsWithNoTags();
  }

  /** MarsBot counts the tagless cards in its own played pile, plus 2. */
  public marsBotScore(bot: IMarsBot): number {
    return bot.playedProjectCards.filter((card) => card.tags.length === 0).length + 2;
  }
}
