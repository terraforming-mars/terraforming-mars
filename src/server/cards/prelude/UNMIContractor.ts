import {Tag} from '../../../common/cards/Tag';
import {PreludeCard} from './PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class UNMIContractor extends PreludeCard {
  constructor() {
    super({
      name: CardName.UNMI_CONTRACTOR,
      tags: [Tag.EARTH],

      behavior: {
        drawCard: 1,
        tr: 3,
      },

      metadata: {
        cardNumber: 'P34',
        renderData: CardRenderer.builder((b) => {
          b.tr(3).br;
          b.cards(1);
        }),
        description: 'Increase your TR 3 steps. Draw a card.',
      },
    });
  }
}
