import {IMilestone} from './IMilestone';
import {Player} from '../Player';

export class Planner implements IMilestone {
  public readonly name = 'Planner';
  public readonly description = 'Having at least 16 cards in your hand when you claim this milestone';
  public getScore(player: Player): number {
    return player.cardsInHand.length;
  }
  public canClaim(player: Player): boolean {
    return this.getScore(player) >= 16;
  }
}
