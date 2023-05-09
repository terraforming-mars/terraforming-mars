import {BaseMilestone} from './IMilestone';
import {Player} from '../Player';

export class Pioneer extends BaseMilestone {
  constructor() {
    super(
      'Pioneer',
      'Have built 3 colonies',
      3);
  }
  public getScore(player: Player): number {
    return player.getColoniesCount();
  }
}
