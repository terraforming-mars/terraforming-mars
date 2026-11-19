import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';
import {Tag} from '../../../common/cards/Tag';
import {BoardName} from '../../../common/boards/BoardName';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {marsBotUsesBoardGoals} from '@/server/automa/MarsBotMilestoneAwardEval';

export class Planetologist extends BaseMilestone {
  public readonly automaDescription = 'Two of Energy, Earth and Venus tracks ≥ 3';
  public readonly automaMapDescriptions = {
    [BoardName.TERRA_CIMMERIA_NOVA]: 'Earth/Jovian + Venus tracks ≥ 5',
  };
  constructor() {
    super(
      'Planetologist',
      'Have 2 Earth tags, 2 Venus tags, and 2 Jovian tags',
      6,
    );
  }

  public getScore(player: IPlayer): number {
    const earthTags = Math.min(player.tags.count(Tag.EARTH, 'raw'), 2);
    const venusTags = Math.min(player.tags.count(Tag.VENUS, 'raw'), 2);
    const jovianTags = Math.min(player.tags.count(Tag.JOVIAN, 'raw'), 2);
    const wildTags = player.tags.count(Tag.WILD, 'milestone');
    return Math.min(earthTags + venusTags + jovianTags + wildTags, 6);
  }

  /**
   * MarsBot needs its Earth and Venus tracks to add up to 5 on Terra Cimmeria (rulebook C p.9).
   *
   * The Milestones & Awards expansion asks for space 3 on two of its Energy, Earth and Venus
   * tracks (rulebook C p.14).
   */
  public marsBotCanClaim(marsBot: IMarsBot): boolean {
    if (marsBotUsesBoardGoals(marsBot, BoardName.TERRA_CIMMERIA_NOVA)) {
      return marsBot.marsBotBoard.trackPosition(Tag.EARTH) + marsBot.marsBotBoard.trackPosition(Tag.VENUS) >= 5;
    }
    const positions = [Tag.POWER, Tag.EARTH, Tag.VENUS].map((tag) => marsBot.marsBotBoard.trackPosition(tag));
    return positions.filter((position) => position >= 3).length >= 2;
  }
}
