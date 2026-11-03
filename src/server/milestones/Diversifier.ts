import {BaseMilestone} from './IMilestone';
import {IPlayer} from '../IPlayer';

export class Diversifier extends BaseMilestone {
  public readonly automaDescription = 'Space 3+ on every track (7 of 8 with Venus)';
  constructor() {
    super(
      'Diversifier',
      'Have 8 different tags in play',
      8);
  }
  public getScore(player: IPlayer): number {
    return player.tags.distinctCount('milestone');
  }
}
