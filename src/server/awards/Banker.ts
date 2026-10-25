import {IAward} from './IAward';
import {IPlayer} from '../IPlayer';
import {Tag} from '@/common/cards/Tag';
import {IMarsBot} from '@/server/automa/MarsBotCorpTypes';
import {marsBotTrackPosition} from '@/server/automa/MarsBotMilestoneAwardEval';

export class Banker implements IAward {
  public readonly name = 'Banker';
  public readonly description = 'Have the most M€ production';
  public getScore(player: IPlayer): number {
    return player.production.megacredits;
  }

  /** Scores the Building and Event track spaces together (rulebook A, p.9). */
  public marsBotScore(bot: IMarsBot): number {
    return marsBotTrackPosition(bot, Tag.BUILDING) + marsBotTrackPosition(bot, Tag.EVENT);
  }
}
