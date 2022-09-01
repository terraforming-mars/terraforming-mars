import {IAward} from './IAward';
import {Player} from '../Player';

export class Hoarder implements IAward {
  public readonly name = 'Hoarder';
  public readonly description = 'Most cards in hand';

  public getScore(player: Player): number {
    return player.cardsInHand.length;
  }
}
