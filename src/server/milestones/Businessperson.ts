import {IMilestone} from './IMilestone';
import {Player} from '../Player';
import {Tag} from '../../common/cards/Tag';

export class Businessperson implements IMilestone {
  public name: string = 'Businessperson';
  public description: string = 'Requires that you have 6 Earth tags in play';
  public getScore(player: Player): number {
    return player.tags.count(Tag.EARTH, 'milestone');
  }
  public canClaim(player: Player): boolean {
    return this.getScore(player) >= 6;
  }
}
