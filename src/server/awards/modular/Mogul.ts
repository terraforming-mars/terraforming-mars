import {IPlayer} from '../../IPlayer';
import {IAward} from '../IAward';
import {IMarsBot} from '../../automa/MarsBotCorpTypes';
import {marsBotAllTrackPositions} from '../../automa/MarsBotMilestoneAwardEval';
export class Mogul implements IAward {
  public readonly name = 'Mogul';
  public readonly description = 'Have the highest production (excluding M€) combined';

  public getScore(player: IPlayer): number {
    return player.production.steel + player.production.titanium + player.production.plants + player.production.energy + player.production.heat;
  }

  /** The automa rules score MarsBot's Mogul as its most advanced track doubled. */
  public marsBotScore(bot: IMarsBot): number {
    return Math.max(...marsBotAllTrackPositions(bot)) * 2;
  }
}
