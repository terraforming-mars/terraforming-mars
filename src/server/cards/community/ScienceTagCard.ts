import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {ProxyCard} from '../ProxyCard';

export class ScienceTagCard extends ProxyCard {
  constructor() {
    super(CardName.SCIENCE_TAG_BLANK_CARD);
  }
  public override get tags() {
    return [Tag.SCIENCE];
  }
}
