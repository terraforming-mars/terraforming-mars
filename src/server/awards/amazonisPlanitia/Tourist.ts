import {RedTourismWave} from '../../cards/turmoil/RedTourismWave';
import {IPlayer} from '../../IPlayer';
import {IAward} from '../IAward';

export class Tourist implements IAward {
  public readonly name = 'Tourist';
  public readonly description = 'Have the most empty spaces adjacent to your tiles';

  public getScore(player: IPlayer): number {
    return RedTourismWave.getAdjacentEmptySpacesCount(player);
  }
}
