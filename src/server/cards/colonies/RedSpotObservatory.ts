import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardResource} from '../../../common/CardResource';
import {CardRenderer} from '../render/CardRenderer';
import {ActionCard} from '../ActionCard';

export class RedSpotObservatory extends ActionCard implements IProjectCard {
  constructor() {
    super({
      cost: 17,
      tags: [Tag.JOVIAN, Tag.SCIENCE],
      name: CardName.RED_SPOT_OBSERVATORY,
      type: CardType.ACTIVE,
      resourceType: CardResource.FLOATER,
      victoryPoints: 2,

      behavior: {
        drawCard: 2,
      },

      action: {
        or: {
          autoSelect: true,
          behaviors: [
            {
              spend: {resourcesHere: 1},
              drawCard: 1,
              title: 'Remove 1 floater here to draw a card',
            },
            {
              addResources: 1,
              title: 'Add 1 floater to this card',
            },
          ],
        },
      },

      requirements: {tag: Tag.SCIENCE, count: 3},
      metadata: {
        cardNumber: 'C32',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 floater to this card, or spend 1 floater here to draw a card.', (eb) => {
            eb.empty().arrow().resource(CardResource.FLOATER).or();
            eb.resource(CardResource.FLOATER).startAction.cards(1);
          }).br;
          b.cards(2);
        }),
        description: {
          text: 'Requires 3 science tags. Draw 2 cards.',
          align: 'left',
        },
      },
    });
  }
}
