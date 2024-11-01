import {IPlayer} from '../../IPlayer';
import {IAward} from '../IAward';
import {ALL_RESOURCES} from '../../../common/Resource';


export class Gatherer implements IAward {
  public readonly name = 'Gatherer';
  public readonly description = 'Have the most different types of resources, both on your player board and on your cards.';

  public getScore(player: IPlayer): number {
    const standardResources = ALL_RESOURCES.filter((res) => player.stock.get(res) > 0).length;
    const nonStandardResources = new Set(player.getCardsWithResources().map((card) => card.resourceType)).size;
    return standardResources + nonStandardResources;
  }
}
