import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';

export class Pioneer extends BaseMilestone {
  constructor() {
    super(
      'Pioneer',
      'Have 3 colonies',
      3);
  }
  public getScore(player: IPlayer): number {
    return player.getColoniesCount();
  }
}
