import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {BaseMilestone} from '../IMilestone';

export class Spacefarer4 extends BaseMilestone {
  constructor() {
    super(
      'Spacefarer4',
      'Have 4 space tags in play',
      4);
  }

  public getScore(player: IPlayer): number {
    return player.tags.count(Tag.SPACE, 'milestone');
  }
}
