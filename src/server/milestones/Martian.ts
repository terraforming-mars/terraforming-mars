import {IMilestone} from './IMilestone';
import {Player} from '../Player';
import {Tag} from '../../common/cards/Tag';

export class Martian implements IMilestone {
  public readonly name = 'Martian';
  public readonly description = 'Requires that you have 4 Mars tags in play';
  public getScore(player: Player): number {
    return player.tags.count(Tag.MARS, 'milestone');
  }
  public canClaim(player: Player): boolean {
    return this.getScore(player) >= 4;
  }
}
