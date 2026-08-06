import {IAward} from './IAward';
import {IPlayer} from '../IPlayer';
import {Tag} from '../../common/cards/Tag';
import {IMarsBot} from '../automa/MarsBotCorpTypes';
import {marsBotTrackPosition} from '../automa/MarsBotMilestoneAwardEval';

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

  /** The automa rules score MarsBot's Thermalist as its fifth track plus 5. */
  public marsBotScore(bot: IMarsBot): number {
    return marsBotTrackPosition(bot, Tag.POWER) + 5;
  }
}
