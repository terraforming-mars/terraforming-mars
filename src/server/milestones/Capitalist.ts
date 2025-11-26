import {BaseMilestone} from '@/server/milestones/IMilestone';
import {IPlayer} from '@/server/IPlayer';

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
