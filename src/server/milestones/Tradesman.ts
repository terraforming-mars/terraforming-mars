import {BaseMilestone} from './IMilestone';
import {Player} from '../Player';

export class Tradesman extends BaseMilestone {
  constructor() {
    super(
      'Tradesman',
      'Have 3 different types of non-standard resources',
      3);
  }

  public getScore(player: Player): number {
    const nonStandardResources = new Set(player.getCardsWithResources().map((card) => card.resourceType));
    return nonStandardResources.size;
  }
}
