import {BaseMilestone} from '@/server/milestones/IMilestone';
import {IPlayer} from '@/server/IPlayer';

export class Mayor extends BaseMilestone {
  constructor() {
    super(
      'Mayor',
      'Own 3 city tiles',
      3);
  }
  public getScore(player: IPlayer): number {
    return player.game.board.getCities(player).length;
  }
}
