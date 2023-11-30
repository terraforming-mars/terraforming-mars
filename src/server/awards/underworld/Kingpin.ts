import {IAward} from '../IAward';
import {IPlayer} from '../../IPlayer';

export class Kingpin implements IAward {
  public readonly name = 'Kingpin';
  public readonly description = 'Play the highest number of cards with a corruption requirement of at least 1. (Event cards count)';
  public getScore(player: IPlayer): number {
    return player.playedCards
      .filter((card) => card.requirements
        .some((requirement) => (requirement.corruption ?? 0) > 0)).length;
  }
}
