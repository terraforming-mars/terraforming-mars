import {IAward} from './IAward';
import {IPlayer} from '../IPlayer';
import {Tag} from '@/common/cards/Tag';
import {IMarsBot} from '@/server/automa/IMarsBot';

export class Industrialist implements IAward {
  public readonly name = 'Industrialist';
  public readonly description = 'Have most steel and energy';
  public readonly automaDescription = 'Energy track + 5';
  public getScore(player: IPlayer): number {
    if (player.game.isDoneWithFinalProduction()) {
      return player.steel + player.energy;
    } else {
      return player.steel + player.production.steel + player.production.energy;
    }
  }

  /** Scores MarsBot's Energy track space plus 5 (rulebook C p.9). */
  public marsBotScore(bot: IMarsBot): number {
    return bot.marsBotBoard.trackPosition(Tag.POWER) + 5;
  }
}
