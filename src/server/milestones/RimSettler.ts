import {IMilestone} from './IMilestone';
import {Player} from '../Player';
import {Tag} from '../../common/cards/Tag';

export class RimSettler implements IMilestone {
  public readonly name = 'Rim Settler';
  public readonly description = 'Requires that you have 3 jovian tags';
  public getScore(player: Player): number {
    return player.tags.count(Tag.JOVIAN, 'milestone');
  }
  public canClaim(player: Player): boolean {
    return this.getScore(player) >= 3;
  }
}
