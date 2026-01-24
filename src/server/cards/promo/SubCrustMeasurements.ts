import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {ActionCard} from '../ActionCard';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class SubCrustMeasurements extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.SUB_CRUST_MEASUREMENTS,
      tags: [Tag.SCIENCE, Tag.BUILDING, Tag.EARTH],
      cost: 20,
      requirements: {tag: Tag.SCIENCE, count: 2},
      victoryPoints: 2,

      action: {
        drawCard: 1,
      },

      metadata: {
        cardNumber: 'X29',
        renderData: CardRenderer.builder((b) => {
          b.action('Draw a card.', (eb) => {
            eb.empty().startAction.cards(1);
          });
        }),
        description: 'Requires 2 science tags.',
      },
    });
  }
}
