import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';
import {BoardName} from '../../../common/boards/BoardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {marsBotUsesBoardGoals} from '@/server/automa/MarsBotMilestoneAwardEval';

export class Fundraiser extends BaseMilestone {
  public readonly automaDescription = 'Event track ≥ 8';
  public readonly automaMapDescriptions = {
    [BoardName.TERRA_CIMMERIA_NOVA]: 'Event track ≥ 10',
  };
  constructor() {
    super(
      'Fundraiser',
      'Have 12 M€ production',
      12);
  }
  public getScore(player: IPlayer): number {
    return player.production.megacredits;
  }

  /**
   * MarsBot needs space 10 of its Event track on Terra Cimmeria, which calls this milestone
   * Financier (rulebook C p.9).
   *
   * The Milestones & Awards expansion asks for space 8 (rulebook C p.13).
   */
  public marsBotCanClaim(marsBot: IMarsBot): boolean {
    const threshold = marsBotUsesBoardGoals(marsBot, BoardName.TERRA_CIMMERIA_NOVA) ? 10 : 8;
    return marsBot.marsBotBoard.trackPosition(Tag.EVENT) >= threshold;
  }
}
