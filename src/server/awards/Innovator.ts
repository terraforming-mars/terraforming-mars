import {IPlayer} from '@/server/IPlayer';
import {IAward} from '@/server/awards/IAward';

export class Innovator implements IAward {
  public readonly name = 'Innovator';
  public readonly description = 'Have played the most green, blue, and red cards (events included).';

  public getScore(player: IPlayer): number {
    // Project cards are exactly the green (automated), blue (active), and red (event) cards.
    // Events stay counted in playedCards, so this includes them.
    return player.playedCards.projects().length;
  }
}
