import {BaseMilestone} from './IMilestone';
import {Player} from '../Player';

export class Smith extends BaseMilestone {
  constructor() {
    super(
      'Smith',
      'Have a total of 7 steel and titanium production',
      7);
  }

  public getScore(player: Player): number {
    return player.production.steel + player.production.titanium;
  }
}
