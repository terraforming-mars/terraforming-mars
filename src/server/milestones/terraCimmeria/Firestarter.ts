import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';

export class Firestarter extends BaseMilestone {
  constructor() {
    super(
      'Firestarter',
      'Have 20 heat',
      20);
  }

  public getScore(player: IPlayer): number {
    return player.heat;
  }
}
