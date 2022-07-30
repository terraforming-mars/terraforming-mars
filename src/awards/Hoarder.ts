import {IAward} from './IAward';
import {Player} from '../Player';

export class Hoarder implements IAward {
  public name: string = 'Hoarder';
  public description: string = 'Most cards in hand';

  public getScore(player: Player): number {
    return player.cardsInHand.length;
  }
}
