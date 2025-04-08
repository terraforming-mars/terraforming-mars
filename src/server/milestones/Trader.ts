import {BaseMilestone} from './IMilestone';
import {IPlayer} from '../IPlayer';
import {CardResource} from '../../common/CardResource';

export class Trader extends BaseMilestone {
  constructor() {
    super(
      'Planner',
      'Have 3 different type of resources on cards',
      3);
  }
  public getScore(player: IPlayer): number {
    const cards = player.getCardsWithResources();
    const resourceTypes = cards.map((card) => card.resourceType);
    // It's never really going to be undefined since getCardWithResources only returns cards with a resource type.
    const set = new Set<CardResource | undefined>(resourceTypes);
    return set.size;
  }
}
