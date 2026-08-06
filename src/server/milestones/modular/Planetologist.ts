import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';
import {Tag} from '../../../common/cards/Tag';
import {IMarsBot} from '../../automa/MarsBotCorpTypes';
import {marsBotTrackPosition} from '../../automa/MarsBotMilestoneAwardEval';

export class Planetologist extends BaseMilestone {
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
    const wildTags = player.tags.count(Tag.WILD);
    return Math.min(earthTags + venusTags + jovianTags + wildTags, 6);
  }

  /** MarsBot qualifies with two of its power, earth and Venus tracks at space 3. */
  public marsBotCanClaim(bot: IMarsBot): boolean {
    const positions = [Tag.POWER, Tag.EARTH, Tag.VENUS].map((tag) => marsBotTrackPosition(bot, tag));
    return positions.filter((position) => position >= 3).length >= 2;
  }
}
