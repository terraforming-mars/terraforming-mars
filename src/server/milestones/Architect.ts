import {TagBasedMilestone} from './TagBasedMilestone';
import {Tag} from '../../common/cards/Tag';

export class Architect extends TagBasedMilestone {
  public readonly automaDescription = 'Science/City track ≥ 6';
  constructor() {
    super('Architect', 'Have 3 city tags in play', 3, [Tag.CITY]);
  }
}
