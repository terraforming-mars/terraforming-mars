import {IAward} from './IAward';
import {IPlayer} from '../IPlayer';
import {IMarsBot} from '@/server/automa/IMarsBot';

export class Benefactor implements IAward {
  public readonly name = 'Benefactor';
  public readonly description = 'Have the highest terraform rating';
  public readonly automaDescription = 'TR - 15';
  public getScore(player: IPlayer): number {
    return player.terraformRating;
  }

  /** Scores MarsBot's TR minus 15, but not below 0 (rulebook C p.9 and p.14). */
  public marsBotScore(bot: IMarsBot): number {
    return Math.max(0, bot.player.terraformRating - 15);
  }
}
