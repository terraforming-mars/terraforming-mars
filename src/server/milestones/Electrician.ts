import {BaseMilestone} from './IMilestone';
import {Player} from '../Player';
import {Tag} from '../../common/cards/Tag';

export class Electrician extends BaseMilestone {
  constructor() {
    super(
      'Electrician',
      'Have 4 power tags',
      4);
  }

  public getScore(player: Player): number {
    return player.tags.count(Tag.POWER, 'milestone');
  }
}
