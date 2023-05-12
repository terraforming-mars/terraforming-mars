import {Player} from '../../Player';
import {IAward} from '../IAward';

export class Politician implements IAward {
  public readonly name = 'Politician';
  public readonly description = 'Place the most delegates';

  public getScore(player: Player): number {
    return player.totalDelegatesPlaced;
  }
}
