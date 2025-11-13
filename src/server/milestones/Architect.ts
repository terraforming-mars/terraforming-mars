import {TagBasedMilestone} from './TagBasedMilestone';
import {Tag} from '../../common/cards/Tag';

export class Architect extends TagBasedMilestone {
  constructor() {
    super('Architect', 'Have 3 city tags in play', 3, [Tag.CITY]);
  }
}
