import {IAward} from './IAward';
import {IPlayer} from '../IPlayer';
import {Tag} from '@/common/cards/Tag';
import {IMarsBot} from '@/server/automa/MarsBotCorpTypes';

export class Banker implements IAward {
  public readonly name = 'Banker';
  public readonly description = 'Have the most M€ production';
  public getScore(player: IPlayer): number {
    return player.production.megacredits;
  }

  public marsBotScore(bot: IMarsBot): number {
    return bot.marsBotBoard.trackPosition(Tag.BUILDING) + bot.marsBotBoard.trackPosition(Tag.EVENT);
  }
}
