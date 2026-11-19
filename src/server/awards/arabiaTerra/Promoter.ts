import {IAward} from '../IAward';
import {IPlayer} from '../../IPlayer';
import {Tag} from '@/common/cards/Tag';
import {IMarsBot} from '@/server/automa/IMarsBot';

export class Promoter implements IAward {
  public readonly name = 'Promoter';
  public readonly description = 'Have the most cards in your event pile';
  public readonly automaDescription = 'Event track';

  public getScore(player: IPlayer): number {
    return player.getPlayedEventsCount();
  }

  /** Rulebook C p.10 and p.15. */
  public marsBotScore(bot: IMarsBot): number {
    return bot.marsBotBoard.trackPosition(Tag.EVENT);
  }
}
