import {BaseMilestone} from './IMilestone'; import {Player} from '../Player';
import {Tag} from '../../common/cards/Tag';

export class Businessperson extends BaseMilestone {
  constructor() {
    super(
      'Businessperson',
      'Requires that you have 6 Earth tags in play',
      6);
  }
  public getScore(player: Player): number {
    return player.tags.count(Tag.EARTH, 'milestone');
  }
}
