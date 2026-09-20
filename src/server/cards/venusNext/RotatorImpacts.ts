import {IActionCard} from '../ICard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {ActionCard} from '../ActionCard';
import {max} from '../Options';

export class RotatorImpacts extends ActionCard implements IActionCard {
  constructor() {
    super({
      name: CardName.ROTATOR_IMPACTS,
      type: CardType.ACTIVE,
      tags: [Tag.SPACE],
      cost: 6,
      resourceType: CardResource.ASTEROID,

      requirements: {venus: 14, max},

      action: {
        or: {
          autoSelect: true,
          behaviors: [
            {
              title: 'Remove 1 asteroid to raise Venus 1 step',
              spend: {resourcesHere: 1},
              global: {venus: 1},
            },
            {
              title: 'Pay 6 M€ to add 1 asteroid to this card',
              spend: {megacredits: 6, canUseTitanium: true},
              addResources: 1,
            },
          ],
        },
      },

      metadata: {
        cardNumber: '243',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(6).super((b) => b.titanium(1)).arrow().resource(CardResource.ASTEROID).br;
          b.or().resource(CardResource.ASTEROID).arrow().venus(1).br;

          b.plainText('Action: Spend 6 M€ to add an asteroid resource to this card [TITANIUM MAY BE USED], or spend 1 resource from this card to increase Venus 1 step.', /* parens */ true);
        }),
        description: 'Venus must be 14% or lower',
      },
    });
  }
}
