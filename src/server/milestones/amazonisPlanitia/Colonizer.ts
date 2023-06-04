import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';

export class Colonizer extends BaseMilestone {
  constructor() {
    super(
      'Colonizer',
      'Have built 4 colonies',
      4);
  }

  public getScore(player: IPlayer): number {
    return player.getColoniesCount();
  }
}
