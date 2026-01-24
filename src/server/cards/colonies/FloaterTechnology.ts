import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardResource} from '../../../common/CardResource';
import {ActionCard} from '../ActionCard';
import {CardRenderer} from '../render/CardRenderer';

export class FloaterTechnology extends ActionCard implements IProjectCard {
  constructor() {
    super({
      cost: 7,
      tags: [Tag.SCIENCE],
      name: CardName.FLOATER_TECHNOLOGY,
      type: CardType.ACTIVE,

      action: {
        addResourcesToAnyCard: {type: CardResource.FLOATER, count: 1 /* , mustHaveCard: true */},
      },

      metadata: {
        cardNumber: 'C12',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 floater to ANOTHER card.', (eb) => {
            eb.empty().startAction.resource(CardResource.FLOATER).asterix();
          });
        }),
      },
    });
  }
}
