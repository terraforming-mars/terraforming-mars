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

  /** Rulebook C p.10. */
  public marsBotScore(bot: IMarsBot): number {
    return Math.max(bot.marsBotBoard.trackPosition(Tag.BUILDING), bot.marsBotBoard.trackPosition(Tag.SPACE));
  }
}
