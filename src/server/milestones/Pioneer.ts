import {BaseMilestone} from './IMilestone';
import {Player} from '../Player';

export class Pioneer extends BaseMilestone {
  constructor() {
    super(
      'Pioneer',
      'Requires that you have 3 colonies in play',
      3);
  }
  public getScore(player: Player): number {
    return player.getColoniesCount();
  }
}
