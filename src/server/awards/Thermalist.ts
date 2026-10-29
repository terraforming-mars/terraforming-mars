import {IAward} from './IAward';
import {IPlayer} from '../IPlayer';
import {Tag} from '@/common/cards/Tag';
import {IMarsBot} from '@/server/automa/MarsBotCorpTypes';

export class Thermalist implements IAward {
  public readonly name = 'Thermalist';
  public readonly description = 'Have the most heat';
  public getScore(player: IPlayer): number {
    if (player.game.isDoneWithFinalProduction()) {
      return player.heat;
    } else {
      return player.energy + player.heat + player.production.heat;
    }
  }

  public marsBotScore(bot: IMarsBot): number {
    return bot.marsBotBoard.trackPosition(Tag.POWER) + 5;
  }
}
