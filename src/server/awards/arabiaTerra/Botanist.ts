import {IAward} from '../IAward';
import {IPlayer} from '../../IPlayer';
import {Tag} from '@/common/cards/Tag';
import {IMarsBot} from '@/server/automa/IMarsBot';

export class Botanist implements IAward {
  public readonly name = 'Botanist';
  public readonly description = 'Have the most plant production';
  public readonly automaDescription = 'Bio track - 2';
  public getScore(player: IPlayer): number {
    return player.production.plants;
  }

  /**
   * Scores MarsBot's Bio track space minus 2 (rulebook C p.10 and p.14).
   *
   * The rulebook doesn't say whether that can go below 0. It stops at 0, so a Bio track below space
   * 2 ties a player with no plant production.
   */
  public marsBotScore(bot: IMarsBot): number {
    return Math.max(0, bot.marsBotBoard.trackPosition(Tag.PLANT) - 2);
  }
}
