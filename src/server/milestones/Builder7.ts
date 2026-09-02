import {BaseMilestone} from './IMilestone';
import {IPlayer} from '../IPlayer';
import {Tag} from '../../common/cards/Tag';

export class Builder7 extends BaseMilestone {
  constructor() {
    super(
      'Builder7',
      'Have 7 building tags in play',
      7);
  }
  public getScore(player: IPlayer): number {
    return player.tags.count(Tag.BUILDING, 'milestone');
  }
}
