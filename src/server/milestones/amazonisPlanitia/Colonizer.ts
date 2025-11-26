import {BaseMilestone} from '@/server/milestones/IMilestone';
import {IPlayer} from '@/server/IPlayer';

export class Colonizer extends BaseMilestone {
  constructor() {
    super(
      'Colonizer',
      'Have 4 colonies',
      4);
  }

  public getScore(player: IPlayer): number {
    return player.getColoniesCount();
  }
}
