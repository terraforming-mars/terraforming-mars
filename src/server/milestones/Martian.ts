import {BaseMilestone} from './IMilestone';
import {Player} from '../Player';
import {Tag} from '../../common/cards/Tag';

export class Martian extends BaseMilestone {
  constructor() {
    super(
      'Martian',
      'Requires that you have 4 Mars tags in play',
      4);
  }
  public getScore(player: Player): number {
    return player.tags.count(Tag.MARS, 'milestone');
  }
}
