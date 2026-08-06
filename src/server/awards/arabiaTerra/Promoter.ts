import {IAward} from '../IAward';
import {IPlayer} from '../../IPlayer';
import {Tag} from '../../../common/cards/Tag';
import {IMarsBot} from '../../automa/MarsBotCorpTypes';
import {marsBotTrackPosition} from '../../automa/MarsBotMilestoneAwardEval';

export class Promoter implements IAward {
  public readonly name = 'Promoter';
  public readonly description = 'Have the most cards in your event pile';

  public getScore(player: IPlayer): number {
    return player.getPlayedEventsCount();
  }

  /** The automa rules score MarsBot's Promoter as its event track. */
  public marsBotScore(bot: IMarsBot): number {
    return marsBotTrackPosition(bot, Tag.EVENT);
  }
}
