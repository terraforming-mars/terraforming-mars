import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';
import {CardResource} from '../../../common/CardResource';
import {Tag} from '@/common/cards/Tag';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {BoardName} from '../../../common/boards/BoardName';
import {marsBotUsesMapSet} from '@/server/automa/MarsBotMilestoneAwardEval';

export class Farmer extends BaseMilestone {
  public readonly automaDescription = 'Bio track ≥ 7';
  public readonly automaMapDescriptions = {
    [BoardName.VASTITAS_BOREALIS_NOVA]: 'Science/Microbe track or Bio track ≥ 6',
  };
  constructor() {
    super(
      'Farmer',
      'Have 5 animal and microbe resources on your cards',
      5);
  }
  public getScore(player: IPlayer): number {
    return player.getResourceCount(CardResource.MICROBE) + player.getResourceCount(CardResource.ANIMAL);
  }

  /**
   * MarsBot has no card resources.
   *
   * On Vastitas Borealis it farms by reaching space 6 of its Science track (shared with
   * Microbe) or of its bio track (rulebook C p.10). The Milestones & Awards expansion asks for
   * space 7 of the bio track (rulebook C p.13).
   */
  public marsBotCanClaim(bot: IMarsBot): boolean {
    if (marsBotUsesMapSet(bot, BoardName.VASTITAS_BOREALIS_NOVA)) {
      return bot.marsBotBoard.trackPosition(Tag.SCIENCE) >= 6 || bot.marsBotBoard.trackPosition(Tag.PLANT) >= 6;
    }
    return bot.marsBotBoard.trackPosition(Tag.PLANT) >= 7;
  }
}
