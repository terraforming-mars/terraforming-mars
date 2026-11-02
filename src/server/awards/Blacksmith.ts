import {IPlayer} from '../IPlayer';
import {IAward} from './IAward';
import {Tag} from '@/common/cards/Tag';
import {IMarsBot} from '@/server/automa/MarsBotCorpTypes';

export class Blacksmith implements IAward {
  public readonly name = 'Blacksmith';
  public readonly description = 'Have the highest production of steel and titanium combined';
  public readonly automaDescription = 'Building OR Space track (higher)';

  public getScore(player: IPlayer): number {
    return player.production.steel + player.production.titanium;
  }

  /** The automa rules score the higher of MarsBot's building and space tracks. */
  public marsBotScore(bot: IMarsBot): number {
    return Math.max(bot.marsBotBoard.trackPosition(Tag.BUILDING), bot.marsBotBoard.trackPosition(Tag.SPACE));
  }
}
