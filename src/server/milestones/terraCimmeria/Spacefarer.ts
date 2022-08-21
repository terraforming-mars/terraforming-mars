import {Tag} from '../../../common/cards/Tag';
import {Player} from '../../Player';
import {IMilestone} from '../IMilestone';

export class Spacefarer implements IMilestone {
  public name: string = 'Spacefarer';
  public description: string = 'Have 6 Space tags';

  public getScore(player: Player): number {
    return player.tags.count(Tag.SPACE);
  }

  public canClaim(player: Player): boolean {
    return this.getScore(player) >= 6;
  }
}
