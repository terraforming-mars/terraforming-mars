import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';

export class Pioneer4 extends BaseMilestone {
  constructor() {
    super(
      'Pioneer4',
      'Have 4 colonies',
      4);
  }
  public getScore(player: IPlayer): number {
    return player.getColoniesCount();
  }
}
