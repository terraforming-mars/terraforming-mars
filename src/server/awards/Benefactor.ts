import {IAward} from './IAward';
import {IPlayer} from '../IPlayer';
import {IMarsBot} from '../automa/MarsBotCorpTypes';

export class Benefactor implements IAward {
  public readonly name = 'Benefactor';
  public readonly description = 'Have the highest terraform rating';
  public getScore(player: IPlayer): number {
    return player.terraformRating;
  }

  /** The automa rules reduce MarsBot's TR by 15 for this award. */
  public marsBotScore(bot: IMarsBot): number {
    return Math.max(0, bot.player.terraformRating - 15);
  }
}
