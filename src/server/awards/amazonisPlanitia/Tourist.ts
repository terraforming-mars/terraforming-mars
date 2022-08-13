import {RedTourismWave} from '../../cards/turmoil/RedTourismWave';
import {Player} from '../../Player';
import {IAward} from '../IAward';

export class Tourist implements IAward {
  public name: string = 'Tourist';
  public description: string = 'Most empty spaces adjacent to your tiles';

  public getScore(player: Player): number {
    return RedTourismWave.getAdjacentEmptySpacesCount(player);
  }
}
