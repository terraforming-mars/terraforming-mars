import {BaseMilestone} from '@/server/milestones/IMilestone';
import {IPlayer} from '@/server/IPlayer';

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
