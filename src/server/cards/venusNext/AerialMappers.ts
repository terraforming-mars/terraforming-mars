import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {ActionCard} from '../ActionCard';

export class AerialMappers extends ActionCard {
  constructor() {
    super({
      name: CardName.AERIAL_MAPPERS,
      type: CardType.ACTIVE,
      tags: [Tag.VENUS],
      cost: 11,
      resourceType: CardResource.FLOATER,
      victoryPoints: 1,

      action: {
        or: {
          autoSelect: true,
          behaviors: [
            {
              spend: {resourcesHere: 1},
              drawCard: 1,
              title: 'Remove 1 floater on this card and draw a card',
            },
            {
              addResourcesToAnyCard: {
                type: CardResource.FLOATER,
                count: 1,
              },
              title: 'Add 1 floater to ANY card',
            },
          ],
        },
      },

      metadata: {
        cardNumber: '213',
        renderData: CardRenderer.builder((b) => {
          b.arrow().resource(CardResource.FLOATER).asterix().nbsp.or().br;
          b.resource(CardResource.FLOATER).arrow().cards(1).br;

          b.plainText('Action: Add floater to ANY card, or spend one floater here to draw 1 card.', /* parens */ true);
        }),
      },
    });
  }
}
