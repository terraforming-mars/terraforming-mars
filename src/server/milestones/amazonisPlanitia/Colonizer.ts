import {Player} from '../../Player';
import {BaseMilestone} from '../IMilestone';

export class Colonizer extends BaseMilestone {
  constructor() {
    super(
      'Colonizer',
      'Have built 4 colonies',
      4);
  }

  public getScore(player: Player): number {
    return player.getColoniesCount();
  }
}
