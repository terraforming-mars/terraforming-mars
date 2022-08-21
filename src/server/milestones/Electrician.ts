import {IMilestone} from './IMilestone';
import {Player} from '../Player';
import {Tag} from '../../common/cards/Tag';

export class Electrician implements IMilestone {
  public name: string = 'Electrician';
  public description: string = 'Have at least 4 Power tags';

  public getScore(player: Player): number {
    return player.tags.count(Tag.ENERGY);
  }

  public canClaim(player: Player): boolean {
    return this.getScore(player) >= 4;
  }
}
