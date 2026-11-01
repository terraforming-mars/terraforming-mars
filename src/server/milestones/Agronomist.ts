import {Tag} from '../../common/cards/Tag';
import {IPlayer} from '../IPlayer';
import {BaseMilestone} from './IMilestone';
import {BoardName} from '../../common/boards/BoardName';

export class Agronomist extends BaseMilestone {
  public readonly automaDescription = 'Bio track ≥ 4';
  public readonly automaMapDescriptions = {
    [BoardName.VASTITAS_BOREALIS_NOVA]: 'Plant/Animal track ≥ 4',
  };
  constructor() {
    super(
      'Agronomist',
      'Have 4 plant tags in play',
      4);
  }

  public getScore(player: IPlayer): number {
    return player.tags.count(Tag.PLANT, 'milestone');
  }
}
