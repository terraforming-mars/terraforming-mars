import {BaseMilestone} from './IMilestone';
import {Player} from '../Player';
import {Tag} from '../../common/cards/Tag';

export class Martian extends BaseMilestone {
  constructor() {
    super(
      'Martian',
      'Have 4 Mars tags',
      4);
  }
  public getScore(player: Player): number {
    return player.tags.count(Tag.MARS, 'milestone');
  }
}
