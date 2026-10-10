import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';
import {Turmoil} from '../../turmoil/Turmoil';

export class Lobbyist extends BaseMilestone {
  constructor() {
    super(
      'Lobbyist',
      'Having all 7 delegates in parties (Party Leaders and Chairman also count)',
      7);
  }
  public getScore(player: IPlayer): number {
    const game = player.game;
    // As a curated milestone (e.g. on Amazonis Planitia) this can be scored in games without
    // Turmoil, where there are no delegates to place.
    if (game.turmoil === undefined) {
      return 0;
    }
    const turmoil = Turmoil.getTurmoil(game);

    return 7 - turmoil.delegateReserve.get(player);
    // if (turmoil.chairman === player) {
    //   delegateCount++;
    // }
  }
}
