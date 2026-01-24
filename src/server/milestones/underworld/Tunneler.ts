import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';

export class Tunneler extends BaseMilestone {
  constructor() {
    super(
      'Tunneler',
      'Have at least 7 underground tokens',
      7);
  }

  public getScore(player: IPlayer): number {
    return player.underworldData.tokens.length;
  }
}
