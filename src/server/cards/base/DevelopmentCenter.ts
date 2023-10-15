import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {ActionCard} from '../ActionCard';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class DevelopmentCenter extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.DEVELOPMENT_CENTER,
      tags: [Tag.SCIENCE, Tag.BUILDING],
      cost: 11,

      action: {
        spend: {energy: 1},
        drawCard: 1,
      },

      metadata: {
        cardNumber: '014',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 energy to draw a card.', (eb) => {
            eb.energy(1).startAction.cards(1);
          });
        }),
      },
    });
  }
}
