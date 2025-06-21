import {Tag} from '../../common/cards/Tag';
import {IPlayer} from '../IPlayer';
import {BaseMilestone} from './IMilestone';

export class Agronomist extends BaseMilestone {
  constructor() {
    super(
      'Agronomist',
      'Have 4 plant tags in play',
      4);
  }

  public getScore(player: IPlayer): number {
    return player.tags.count(Tag.PLANT);
  }
}
