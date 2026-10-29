import {IAward} from './IAward';
import {IPlayer} from '../IPlayer';
import {Tag} from '@/common/cards/Tag';
import {IMarsBot} from '@/server/automa/MarsBotCorpTypes';

export class Miner implements IAward {
  public readonly name = 'Miner';
  public readonly description = 'Have the most steel and titanium';
  public getScore(player: IPlayer): number {
    if (player.game.isDoneWithFinalProduction()) {
      return player.steel + player.titanium;
    } else {
      return player.steel + player.production.steel + player.titanium + player.production.titanium;
    }
  }

  public marsBotScore(bot: IMarsBot): number {
    return bot.marsBotBoard.trackPosition(Tag.SPACE) + 5;
  }
}
