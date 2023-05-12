import {Player} from '../../Player';
import {BaseMilestone} from '../IMilestone';

export class Firestarter extends BaseMilestone {
  constructor() {
    super(
      'Firestarter',
      'Have 20 heat',
      20);
  }

  public getScore(player: Player): number {
    return player.heat;
  }
}
