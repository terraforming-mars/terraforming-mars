import {IAward} from './IAward';
import {Player} from '../Player';

export class Coordinator implements IAward {
  public readonly name = 'Coordinator';
  public readonly description = 'Having the most event cards in play';

  public getScore(player: Player): number {
    return player.getPlayedEventsCount();
  }
}
