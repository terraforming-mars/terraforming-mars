import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';

export class Economizer extends BaseMilestone {
  constructor() {
    super(
      'Economizer',
      'Have 5 heat production',
      5);
  }
  public getScore(player: IPlayer): number {
    return player.production.heat;
  }
}
