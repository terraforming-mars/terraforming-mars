import {BaseMilestone} from './IMilestone';
import {IPlayer} from '../IPlayer';

export class Diversifier extends BaseMilestone {
  constructor() {
    super(
      'Diversifier',
      'Have 8 different tags',
      8);
  }
  public getScore(player: IPlayer): number {
    return player.tags.distinctCount('milestone');
  }
}
