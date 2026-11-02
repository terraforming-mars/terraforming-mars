import {BaseMilestone} from './IMilestone';
import {IPlayer} from '../IPlayer';
import {Tag} from '../../common/cards/Tag';
import {BoardName} from '../../common/boards/BoardName';

export class RimSettler extends BaseMilestone {
  public readonly automaDescription = 'Energy track ≥ 5';
  public readonly automaMapDescriptions = {
    [BoardName.HELLAS]: 'Science/Jovian track ≥ 6',
  };
  constructor() {
    super(
      'Rim Settler',
      'Have 3 Jovian tags in play',
      3);
  }
  public getScore(player: IPlayer): number {
    return player.tags.count(Tag.JOVIAN, 'milestone');
  }
}
