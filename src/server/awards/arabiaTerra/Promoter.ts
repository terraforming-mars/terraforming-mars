import {IAward} from '@/server/awards/IAward';
import {IPlayer} from '@/server/IPlayer';

export class Promoter implements IAward {
  public readonly name = 'Promoter';
  public readonly description = 'Have the most cards in your event pile';

  public getScore(player: IPlayer): number {
    return player.getPlayedEventsCount();
  }
}
