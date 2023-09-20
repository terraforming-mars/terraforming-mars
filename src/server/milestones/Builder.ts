import {BaseMilestone} from './IMilestone';
import {IPlayer} from '../IPlayer';
import {Tag} from '../../common/cards/Tag';

export class Builder extends BaseMilestone {
  constructor() {
    super(
      'Builder',
      'Have 8 building tags in play',
      8);
  }
  public getScore(player: IPlayer): number {
    return player.tags.count(Tag.BUILDING, 'milestone');
  }
}
