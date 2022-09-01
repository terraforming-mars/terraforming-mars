import {IMilestone} from './IMilestone';
import {Player} from '../Player';

export class Tradesman implements IMilestone {
  public readonly name = 'Tradesman';
  public readonly description = 'Have at least 3 different types of non-standard resources';

  public getScore(player: Player): number {
    const nonStandardResources = new Set(player.getCardsWithResources().map((card) => card.resourceType));
    return nonStandardResources.size;
  }

  public canClaim(player: Player): boolean {
    return this.getScore(player) >= 3;
  }
}
