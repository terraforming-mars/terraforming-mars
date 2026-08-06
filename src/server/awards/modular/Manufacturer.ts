import {IPlayer} from '../../IPlayer';
import {IAward} from '../IAward';
import {Tag} from '../../../common/cards/Tag';
import {IMarsBot} from '../../automa/MarsBotCorpTypes';
import {marsBotTrackPosition} from '../../automa/MarsBotMilestoneAwardEval';
export class Manufacturer implements IAward {
  public readonly name = 'Manufacturer';
  public readonly description = 'Have the highest production of steel and heat combined.';

  public getScore(player: IPlayer): number {
    return player.production.steel + player.production.heat;
  }

  /** The automa rules score MarsBot's Manufacturer as its building and power tracks together. */
  public marsBotScore(bot: IMarsBot): number {
    return marsBotTrackPosition(bot, Tag.BUILDING) + marsBotTrackPosition(bot, Tag.POWER);
  }
}
