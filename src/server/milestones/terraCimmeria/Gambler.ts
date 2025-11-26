import {BaseMilestone} from '@/server/milestones/IMilestone';
import {IPlayer} from '@/server/IPlayer';

export class Gambler extends BaseMilestone {
  constructor() {
    super(
      'Gambler',
      'Fund 2 awards',
      2);
  }

  public getScore(player: IPlayer): number {
    return player.game.fundedAwards.filter((award) => award.player === player).length;
  }
}
