import {BaseMilestone} from './IMilestone';
import {Player} from '../Player';
import {Tag} from '../../common/cards/Tag';

export class RimSettler extends BaseMilestone {
  constructor() {
    super(
      'Rim Settler',
      'Have 3 Jovian tags',
      3);
  }
  public getScore(player: Player): number {
    return player.tags.count(Tag.JOVIAN, 'milestone');
  }
}
