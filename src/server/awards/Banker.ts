import {IAward} from './IAward';
import {IPlayer} from '../IPlayer';
import {Tag} from '../../common/cards/Tag';
import {IMarsBot} from '../automa/MarsBotCorpTypes';
import {marsBotTrackPosition} from '../automa/MarsBotMilestoneAwardEval';

export class Banker implements IAward {
  public readonly name = 'Banker';
  public readonly description = 'Have the most M€ production';
  public getScore(player: IPlayer): number {
    return player.production.megacredits;
  }

  /** The automa rules score MarsBot's Banker as its first and third track together. */
  public marsBotScore(bot: IMarsBot): number {
    return marsBotTrackPosition(bot, Tag.BUILDING) + marsBotTrackPosition(bot, Tag.EVENT);
  }
}
