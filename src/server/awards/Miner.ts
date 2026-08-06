import {IAward} from './IAward';
import {IPlayer} from '../IPlayer';
import {Tag} from '../../common/cards/Tag';
import {IMarsBot} from '../automa/MarsBotCorpTypes';
import {marsBotTrackPosition} from '../automa/MarsBotMilestoneAwardEval';

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

  /** The automa rules score MarsBot's Miner as its second track plus 5. */
  public marsBotScore(bot: IMarsBot): number {
    return marsBotTrackPosition(bot, Tag.SPACE) + 5;
  }
}
