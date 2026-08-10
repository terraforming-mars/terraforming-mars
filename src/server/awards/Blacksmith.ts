import {IPlayer} from '../IPlayer';
import {IAward} from './IAward';
import {Tag} from '../../common/cards/Tag';
import {IMarsBot} from '../automa/MarsBotCorpTypes';
import {marsBotTrackPosition} from '../automa/MarsBotMilestoneAwardEval';

export class Blacksmith implements IAward {
  public readonly name = 'Blacksmith';
  public readonly description = 'Have the highest production of steel and titanium combined';

  public getScore(player: IPlayer): number {
    return player.production.steel + player.production.titanium;
  }

  /** The automa rules score the higher of MarsBot's building and space tracks. */
  public marsBotScore(bot: IMarsBot): number {
    return Math.max(marsBotTrackPosition(bot, Tag.BUILDING), marsBotTrackPosition(bot, Tag.SPACE));
  }
}
