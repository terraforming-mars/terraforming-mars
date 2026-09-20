import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {ActionCard} from '../ActionCard';

export class ExtractorBalloons extends ActionCard {
  constructor() {
    super({
      name: CardName.EXTRACTOR_BALLOONS,
      type: CardType.ACTIVE,
      tags: [Tag.VENUS],
      cost: 21,
      resourceType: CardResource.FLOATER,

      behavior: {
        addResources: 3,
      },

      action: {
        or: {
          autoSelect: true,
          behaviors: [{
            title: 'Remove 2 floaters here to raise Venus 1 step.',
            spend: {resourcesHere: 2},
            global: {venus: 1},
          },
          {
            title: 'Add 1 floater to this card.',
            addResources: 1,
          }],
        },
      },

      metadata: {
        cardNumber: '223',
        renderData: CardRenderer.builder((b) => {
          b.arrow().resource(CardResource.FLOATER).br;
          b.or(Size.SMALL).resource(CardResource.FLOATER, 2).arrow().venus(1).br;

          b.plainText('Action: Add 1 floater to this card, or remove 2 floaters here to raise Venus 1 step.', /* parens */ true);
          b.br;
          b.resource(CardResource.FLOATER, 3).plainText('Add 3 floaters to this card.', true);
        }),
      },
    });
  }
}
