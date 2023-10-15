import {IPlayer} from '../../IPlayer';
import {IAward} from '../IAward';

export class Politician implements IAward {
  public readonly name = 'Politician';
  public readonly description = 'Place the most delegates';

  public getScore(player: IPlayer): number {
    return player.totalDelegatesPlaced;
  }
}
