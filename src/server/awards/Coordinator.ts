import {IAward} from './IAward';
import {IPlayer} from '../IPlayer';

export class Coordinator implements IAward {
  public readonly name = 'Coordinator';
  public readonly description = 'Have the most cards in your event pile';

  public getScore(player: IPlayer): number {
    return player.getPlayedEventsCount();
  }
}
