import {IPlayer} from '../../IPlayer';
import {IAward} from '../IAward';

export class Administrator implements IAward {
  public readonly name = 'Administrator';
  public readonly description = 'Have the most cards with no tags';

  public getScore(player: IPlayer): number {
    return player.tags.numberOfCardsWithNoTags();
  }
}
