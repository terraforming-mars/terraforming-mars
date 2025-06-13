import {BaseMilestone} from './IMilestone';
import {IPlayer} from '../IPlayer';

export class Tradesman extends BaseMilestone {
  constructor() {
    super(
      'Tradesman',
      'Have 3 different types of non-standard resources',
      3);
  }

  public getScore(player: IPlayer): number {
    const nonStandardResources = new Set(player.getCardsWithResources().map((card) => card.resourceType));
    if (player.underworldData.corruption > 0) {
      return nonStandardResources.size + 1;
    } else {
      return nonStandardResources.size;
    }
  }
}
