import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {ActionCard} from '../ActionCard';

export class HE3Refinery extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.HE3_REFINERY,
      cost: 8,
      tags: [Tag.MOON],

      action: {
        stock: {megacredits: {moon: {miningRate: {}}}},
      },

      metadata: {
        cardNumber: 'M49',
        renderData: CardRenderer.builder((b) => {
          b.action('Gain 1 M€ for each level of mining rate.', (eb) => {
            eb.empty().startAction;
            eb.megacredits(1).slash().moonMiningRate();
          });
        }),
      },
    });
  }
}
