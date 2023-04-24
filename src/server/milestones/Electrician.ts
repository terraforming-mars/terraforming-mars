import {BaseMilestone} from './IMilestone';
import {Player} from '../Player';
import {Tag} from '../../common/cards/Tag';

export class Electrician extends BaseMilestone {
  constructor() {
    super(
      'Electrician',
      'Have at least 4 Power tags',
      4);
  }

  public getScore(player: Player): number {
    return player.tags.count(Tag.POWER, 'milestone');
  }
}
