import {IPlayer} from '../../IPlayer';
import {IAward} from '../IAward';

export class Historian implements IAward {
  public readonly name = 'Historian';
  public readonly description = 'Have the most cards in your event pile';

  public getScore(player: IPlayer): number {
    return player.getPlayedEventsCount();
  }
}
