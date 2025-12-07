import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';
import {MilestoneName} from '@/common/ma/MilestoneName';

export class Forester extends BaseMilestone {
  constructor(name: MilestoneName = 'Forester', threshold: number = 4) {
    super(name, `Have ${threshold} plant production`, threshold);
  }

  public getScore(player: IPlayer): number {
    return player.production.plants;
  }
}

// Forester variant from Terra Cimmeria Novus.
export class CForester extends Forester {
  constructor() {
    super('C. Forester', 3);
  }
}
