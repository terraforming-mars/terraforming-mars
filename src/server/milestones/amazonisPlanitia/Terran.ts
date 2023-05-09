import {Tag} from '../../../common/cards/Tag';
import {Player} from '../../Player';
import {BaseMilestone} from '../IMilestone';

export class Terran extends BaseMilestone {
  constructor() {
    super(
      'Terran',
      'Have 6 Earth tags',
      6);
  }

  public getScore(player: Player): number {
    return player.tags.count(Tag.EARTH, 'milestone');
  }
}
