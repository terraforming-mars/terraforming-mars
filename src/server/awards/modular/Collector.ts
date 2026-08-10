import {IPlayer} from '../../IPlayer';
import {IAward} from '../IAward';
import {ALL_RESOURCES} from '../../../common/Resource';
import {IMarsBot} from '../../automa/MarsBotCorpTypes';
import {marsBotAllTrackPositions} from '../../automa/MarsBotMilestoneAwardEval';


export class Collector implements IAward {
  public readonly name = 'Collector';
  public readonly description = 'Have the most different types of resources, both on your player board and on your cards.';

  public getScore(player: IPlayer): number {
    const standardResources = ALL_RESOURCES.filter((res) => player.stock.get(res) > 0).length;
    const nonStandardResources = new Set(player.getCardsWithResources().map((card) => card.resourceType)).size;
    return standardResources + nonStandardResources;
  }

  /** The automa rules score MarsBot's Collector as the number of tracks at space 3. */
  public marsBotScore(bot: IMarsBot): number {
    return marsBotAllTrackPositions(bot).filter((position) => position >= 3).length;
  }
}
