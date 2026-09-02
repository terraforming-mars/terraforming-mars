import {IProjectCard} from '../IProjectCard';
import {IActionCard} from '../ICard';
import {ActionCard} from '../ActionCard';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardResource} from '../../../common/CardResource';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';

export class DirectedImpactors extends ActionCard implements IActionCard, IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.DIRECTED_IMPACTORS,
      tags: [Tag.SPACE],
      cost: 8,
      resourceType: CardResource.ASTEROID,

      action: {
        or: {
          autoSelect: true,
          behaviors: [
            {
              title: 'Remove 1 asteroid to raise temperature 1 step',
              spend: {resourcesHere: 1},
              global: {temperature: 1},
            },
            {
              title: 'Pay 6 M€ to add 1 asteroid to a card',
              spend: {megacredits: 6, canUseTitanium: true},
              addResourcesToAnyCard: {count: 1, type: CardResource.ASTEROID},
            },
          ],
        },
      },

      metadata: {
        cardNumber: 'X19',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(6).super((b) => b.titanium(1)).arrow().resource(CardResource.ASTEROID).asterix().nbsp.or().br;
          b.resource(CardResource.ASTEROID).arrow().temperature(1).br;

          b.plainText('Action: Spend 6 M€ to add 1 asteroid to ANY CARD (titanium may be used to pay for this), or remove 1 asteroid here to raise temperature 1 step.', /* parens */ true);
        }),
      },
    });
  }
}
