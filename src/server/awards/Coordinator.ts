import {IAward} from './IAward';
import {Player} from '../Player';

export class Coordinator implements IAward {
  public readonly name = 'Coordinator';
  public readonly description = 'Have the most event cards';

  public getScore(player: Player): number {
    return player.getPlayedEventsCount();
  }
}
