import {BaseMilestone} from '@/server/milestones/IMilestone';
import {IPlayer} from '@/server/IPlayer';

export class Fundraiser extends BaseMilestone {
  constructor() {
    super(
      'Fundraiser',
      'Have 12 M€ production',
      12);
  }
  public getScore(player: IPlayer): number {
    return player.production.megacredits;
  }
}
