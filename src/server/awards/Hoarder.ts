import {IAward} from './IAward';
import {IPlayer} from '../IPlayer';

export class Hoarder implements IAward {
  public readonly name = 'Hoarder';
  public readonly description = 'Have the most cards in hand';

  public getScore(player: IPlayer): number {
    return player.cardsInHand.length;
  }
}
