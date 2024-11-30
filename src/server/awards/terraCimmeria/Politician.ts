import {IPlayer} from '../../IPlayer';
import {IAward} from '../IAward';

// TODO(kberg): Rename this file
export class TPolitician implements IAward {
  public readonly name = 'T. Politician';
  public readonly description = 'Place the most delegates';

  public getScore(player: IPlayer): number {
    return player.totalDelegatesPlaced;
  }
}
