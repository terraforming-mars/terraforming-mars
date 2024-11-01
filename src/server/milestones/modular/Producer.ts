import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';

export class Producer extends BaseMilestone {
  constructor() {
    super(
      'Producer',
      'Have a combined total production of at least 16',
      16);
  }

  public getScore(player: IPlayer): number {
    return player.production.megacredits + player.production.steel + player.production.titanium + player.production.plants + player.production.energy + player.production.heat;
  }
}
