import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';
import {MilestoneName} from '../../../common/ma/MilestoneName';
import {Tag} from '../../../common/cards/Tag';
import {IMarsBot} from '../../automa/MarsBotCorpTypes';
import {marsBotTrackPosition} from '../../automa/MarsBotMilestoneAwardEval';

export class Forester extends BaseMilestone {
  constructor(name: MilestoneName = 'Forester', threshold: number = 4) {
    super(name, `Have ${threshold} plant production`, threshold);
  }

  public getScore(player: IPlayer): number {
    return player.production.plants;
  }

  /** The automa rules put MarsBot's threshold at space 6 of its bio track. */
  public marsBotCanClaim(bot: IMarsBot): boolean {
    return marsBotTrackPosition(bot, Tag.PLANT) >= 6;
  }
}

// Forester variant from Terra Cimmeria Nova.
export class CForester extends Forester {
  constructor() {
    super('C. Forester', 3);
  }

  /** The automa rules put MarsBot's threshold at space 10 of its bio track. */
  public override marsBotCanClaim(bot: IMarsBot): boolean {
    return marsBotTrackPosition(bot, Tag.PLANT) >= 10;
  }
}
