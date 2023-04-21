import {BaseMilestone} from './IMilestone';
import {Player} from '../Player';
import {Tag} from '../../common/cards/Tag';

export class Builder extends BaseMilestone {
  constructor() {
    super(
      'Builder',
      'Have at least 8 building tags in play',
      8);
  }
  public getScore(player: Player): number {
    return player.tags.count(Tag.BUILDING, 'milestone');
  }
}
