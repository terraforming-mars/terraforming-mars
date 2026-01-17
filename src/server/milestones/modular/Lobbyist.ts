import {BaseMilestone} from '@/server/milestones/IMilestone';
import {IPlayer} from '@/server/IPlayer';
import {Turmoil} from '@/server/turmoil/Turmoil';

export class Lobbyist extends BaseMilestone {
  constructor() {
    super(
      'Lobbyist',
      'Having all 7 delegates in parties (Party Leaders and Chairman also count)',
      7);
  }
  public getScore(player: IPlayer): number {
    const game = player.game;
    const turmoil = Turmoil.getTurmoil(game);

    return 7 - turmoil.delegateReserve.get(player);
    // if (turmoil.chairman === player) {
    //   delegateCount++;
    // }
  }
}
