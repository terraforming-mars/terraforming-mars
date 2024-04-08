import {BaseMilestone} from './IMilestone';
import {IPlayer} from '../IPlayer';

export class Capitalist extends BaseMilestone {
  constructor() {
    super(
      'Capitalist',
      'Have 64 M€',
      64);
  }

  public getScore(player: IPlayer): number {
    return player.megaCredits;
  }
}
