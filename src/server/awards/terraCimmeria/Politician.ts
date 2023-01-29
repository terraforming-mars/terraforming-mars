import {Player} from '../../Player';
import {IAward, getAdditionalScore} from '../IAward';

export class Politician implements IAward {
  public readonly name = 'Politician';
  public readonly description = 'Most delegates placed during the game';

  public getScore(player: Player): number {
    const score = player.totalDelegatesPlaced + getAdditionalScore(player);
    return score + getAdditionalScore(player);
  }
}
