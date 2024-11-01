import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';

export class Producer extends BaseMilestone {
  constructor() {
    super(
      'Producer',
      'Have a total of 16 total production',
      16);
  }

  public getScore(player: IPlayer): number {
    return player.production.megacredits + player.production.steel + player.production.titanium + player.production.plants + player.production.energy + player.production.heat;
  }
}
