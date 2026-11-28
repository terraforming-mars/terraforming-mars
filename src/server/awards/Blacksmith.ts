import {IPlayer} from '../IPlayer';
import {IAward} from './IAward';
import {Tag} from '@/common/cards/Tag';
import {IMarsBot} from '@/server/automa/IMarsBot';

export class Blacksmith implements IAward {
  public readonly name = 'Blacksmith';
  public readonly description = 'Have the highest production of steel and titanium combined';
  public readonly automaDescription = 'Building OR Space track (higher)';

  public getScore(player: IPlayer): number {
    return player.production.steel + player.production.titanium;
  }

  /** Rulebook C p.10. */
  public marsBotScore(marsBot: IMarsBot): number {
    return Math.max(marsBot.marsBotBoard.trackPosition(Tag.BUILDING), marsBot.marsBotBoard.trackPosition(Tag.SPACE));
  }
}
