import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';
import {MilestoneName} from '../../../common/ma/MilestoneName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBot} from '@/server/automa/IMarsBot';

export class Forester extends BaseMilestone {
  public readonly automaDescription: string = 'Bio track ≥ 6';
  constructor(name: MilestoneName = 'Forester', threshold: number = 4) {
    super(name, `Have ${threshold} plant production`, threshold);
  }

  public getScore(player: IPlayer): number {
    return player.production.plants;
  }

  /** MarsBot needs space 6 of its Bio track (rulebook C p.13). */
  public marsBotCanClaim(marsBot: IMarsBot): boolean {
    return marsBot.marsBotBoard.trackPosition(Tag.PLANT) >= 6;
  }
}

// Forester variant from Terra Cimmeria Nova.
export class CForester extends Forester {
  public override readonly automaDescription = 'Bio track ≥ 10';
  constructor() {
    super('C. Forester', 3);
  }

  /** MarsBot needs space 10 of its Bio track on Terra Cimmeria (rulebook C p.9). */
  public override marsBotCanClaim(marsBot: IMarsBot): boolean {
    return marsBot.marsBotBoard.trackPosition(Tag.PLANT) >= 10;
  }
}
