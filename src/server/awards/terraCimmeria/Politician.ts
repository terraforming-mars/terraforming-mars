import {Player} from '../../Player';
import {IAward} from '../IAward';

export class Politician implements IAward {
  public name: string = 'Politician';
  public description: string = 'Most delegates placed during the game';

  public getScore(player: Player): number {
    return player.totalDelegatesPlaced;
  }
}
