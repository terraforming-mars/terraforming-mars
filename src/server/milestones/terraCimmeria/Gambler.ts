import {Player} from '../../Player';
import {BaseMilestone} from '../IMilestone';

export class Gambler extends BaseMilestone {
  constructor() {
    super(
      'Gambler',
      'Fund 2 awards',
      2);
  }

  public getScore(player: Player): number {
    return player.game.fundedAwards.filter((award) => award.player === player).length;
  }
}
