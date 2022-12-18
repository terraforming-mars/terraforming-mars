import {RedTourismWave} from '../../cards/turmoil/RedTourismWave';
import {Player} from '../../Player';
import {IAward, getAdditionalScore} from '../IAward';

export class Tourist implements IAward {
  public readonly name = 'Tourist';
  public readonly description = 'Most empty spaces adjacent to your tiles';

  public getScore(player: Player): number {
    const score = RedTourismWave.getAdjacentEmptySpacesCount(player);
    return score + getAdditionalScore(player);
  }
}
