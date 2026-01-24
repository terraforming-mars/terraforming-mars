import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';
import {Tag} from '../../../common/cards/Tag';

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
}
