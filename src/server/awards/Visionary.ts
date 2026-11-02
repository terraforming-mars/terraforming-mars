import {IAward} from './IAward';
import {IPlayer} from '../IPlayer';

export class Visionary implements IAward {
  public readonly name = 'Visionary';
  public readonly description = 'Have the most cards in hand';
  public readonly automaDescription = 'Lowest track × 2 (second lowest with Venus)';

  public getScore(player: IPlayer): number {
    return player.cardsInHand.length;
  }
}
