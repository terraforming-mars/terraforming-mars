import {Tag} from '../../../common/cards/Tag';
import {Player} from '../../Player';
import {BaseMilestone} from '../IMilestone'; export class Spacefarer extends BaseMilestone {
  constructor() {
    super(
      'Spacefarer',
      'Have 6 space tags',
      6);
  }

  public getScore(player: Player): number {
    return player.tags.count(Tag.SPACE);
  }
}
