import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';
import {MilestoneName} from '../../../common/ma/MilestoneName';

export class Forester extends BaseMilestone {
  public readonly automaDescription: string = 'Bio track ≥ 6';
  constructor(name: MilestoneName = 'Forester', threshold: number = 4) {
    super(name, `Have ${threshold} plant production`, threshold);
  }

  public getScore(player: IPlayer): number {
    return player.production.plants;
  }
}

// Forester variant from Terra Cimmeria Nova.
export class CForester extends Forester {
  public override readonly automaDescription = 'Bio track ≥ 10';
  constructor() {
    super('C. Forester', 3);
  }
}
