import {Tag} from '../../../common/cards/Tag';
import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';

export class Terran extends BaseMilestone {
  constructor() {
    super(
      'Terran',
      'Have 5 Earth tags in play',
      5);
  }

  public getScore(player: IPlayer): number {
    return player.tags.count(Tag.EARTH, 'milestone');
  }
}
