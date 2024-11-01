import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';

export class Lobbyist extends BaseMilestone {
  constructor() {
    super(
      'Lobbyist',
      'Having all 7 delegates in parties (Party Leaders and Chairman also count)',
      7);
  }
  public getScore(player: IPlayer): number {
    const turmoil = player.game.turmoil;
    if (turmoil === undefined) return 0; // bunch of errors if turmoil is not enabled, however this is going to be avaialble only with turmoil
    return (7 - turmoil.getAvailableDelegateCount(player));
  }
}
