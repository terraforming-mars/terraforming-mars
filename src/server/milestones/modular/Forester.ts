import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';

export class Forester extends BaseMilestone {
  constructor() {
    super(
      'Forester',
      'Have 4 plant production',
      4);
  }

  public getScore(player: IPlayer): number {
    return player.production.plants;
  }
}
