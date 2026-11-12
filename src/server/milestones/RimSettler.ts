import {BaseMilestone} from './IMilestone';
import {IPlayer} from '../IPlayer';
import {Tag} from '../../common/cards/Tag';
import {BoardName} from '../../common/boards/BoardName';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {marsBotUsesBoardGoals} from '@/server/automa/MarsBotMilestoneAwardEval';

export class RimSettler extends BaseMilestone {
  public readonly automaDescription = 'Energy track ≥ 5';
  public readonly automaMapDescriptions = {
    [BoardName.HELLAS]: 'Science/Jovian track ≥ 6',
  };
  constructor() {
    super(
      'Rim Settler',
      'Have 3 Jovian tags in play',
      3);
  }
  public getScore(player: IPlayer): number {
    return player.tags.count(Tag.JOVIAN, 'milestone');
  }

  /**
   * MarsBot needs space 6 of its Jovian track on Hellas (rulebook C p.9), which it shares with
   * Science there (rulebook C p.8).
   *
   * The Milestones & Awards expansion asks for space 5 of the Energy track (rulebook C p.14).
   */
  public marsBotCanClaim(bot: IMarsBot): boolean {
    if (marsBotUsesBoardGoals(bot, BoardName.HELLAS)) {
      return bot.marsBotBoard.trackPosition(Tag.JOVIAN) >= 6;
    }
    return bot.marsBotBoard.trackPosition(Tag.POWER) >= 5;
  }
}
