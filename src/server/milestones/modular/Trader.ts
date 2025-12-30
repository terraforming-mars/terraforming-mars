import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';

export class Trader extends BaseMilestone {
  constructor() {
    super(
      'Trader',
      'Have 3 different types of resources on cards',
      3);
  }

  public getScore(player: IPlayer): number {
    const nonStandardResources = new Set(player.getCardsWithResources().map((card) => card.resourceType));
    return nonStandardResources.size;
  }
}
