import {IMilestone} from './IMilestone';
import {Player} from '../Player';
import {Tags} from '../common/cards/Tags';

export class RimSettler implements IMilestone {
  public name: string = 'Rim Settler';
  public description: string = 'Requires that you have 3 jovian tags';
  public getScore(player: Player): number {
    return player.getTagCount(Tags.JOVIAN, 'milestone');
  }
  public canClaim(player: Player): boolean {
    return this.getScore(player) >= 3;
  }
}
