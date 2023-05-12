import {Player} from '../../Player';
import {IAward} from '../IAward';

export class Historian implements IAward {
  public readonly name = 'Historian';
  public readonly description = 'Play the most event cards';

  public getScore(player: Player): number {
    return player.getPlayedEventsCount();
  }
}
