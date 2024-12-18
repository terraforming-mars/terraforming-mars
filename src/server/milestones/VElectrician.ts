import {BaseMilestone} from './IMilestone';
import {IPlayer} from '../IPlayer';
import {Tag} from '../../common/cards/Tag';

export class VElectrician extends BaseMilestone {
  constructor() {
    super(
      'V. Electrician',
      'Have 4 power tags in play',
      4);
  }

  public getScore(player: IPlayer): number {
    return player.tags.count(Tag.POWER, 'milestone');
  }
}
