import {IActionCard} from '../ICard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {ActionCard} from '../ActionCard';

export class ForcedPrecipitation extends ActionCard implements IActionCard {
  constructor() {
    super({
      name: CardName.FORCED_PRECIPITATION,
      type: CardType.ACTIVE,
      tags: [Tag.VENUS],
      cost: 8,
      resourceType: CardResource.FLOATER,

      action: {
        or: {
          autoSelect: true,
          behaviors: [
            {title: 'Remove 2 floaters here to raise Venus 1 step', spend: {resourcesHere: 2}, global: {venus: 1}},
            {title: 'Pay 2 M€ to add 1 floater to this card', spend: {megacredits: 2}, addResources: 1},
          ],
        },
      },

      metadata: {
        cardNumber: '226',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(2).arrow().resource(CardResource.FLOATER).nbsp.or().br;
          b.resource(CardResource.FLOATER, 2).arrow().venus(1).br;

          b.plainText('Action: Spend 2 M€ to add 1 floater to THIS card, or spend 2 floaters here to increase Venus 1 step.', /* parens */ true);
        }),
      },
    });
  }
}
