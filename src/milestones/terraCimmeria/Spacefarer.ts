import {Tags} from '../../common/cards/Tags';
import {Player} from '../../Player';
import {IMilestone} from '../IMilestone';

export class Spacefarer implements IMilestone {
  public name: string = 'Spacefarer';
  public description: string = 'Have 6 Space tags';

  public getScore(player: Player): number {
    return player.getTagCount(Tags.SPACE);
  }

  public canClaim(player: Player): boolean {
    return this.getScore(player) >= 6;
  }
}
