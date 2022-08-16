import {Player} from '../../Player';
import {IAward} from '../IAward';

export class Historian implements IAward {
  public name: string = 'Historian';
  public description: string = 'Most event cards played';

  public getScore(player: Player): number {
    return player.getPlayedEventsCount();
  }
}
