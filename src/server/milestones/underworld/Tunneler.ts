import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';
import {UnderworldExpansion} from '../../underworld/UnderworldExpansion';

export class Tunneler extends BaseMilestone {
  constructor() {
    super(
      'Tunneler',
      'Have at least 7 excavation markers',
      7);
  }

  public getScore(player: IPlayer): number {
    return UnderworldExpansion.excavationMarkerCount(player);
  }
}
