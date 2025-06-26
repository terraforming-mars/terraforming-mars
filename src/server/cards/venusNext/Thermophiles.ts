import {IActionCard} from '../ICard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {ActionCard} from '../ActionCard';

export class Thermophiles extends ActionCard implements IActionCard {
  constructor() {
    super({
      name: CardName.THERMOPHILES,
      type: CardType.ACTIVE,
      tags: [Tag.VENUS, Tag.MICROBE],
      cost: 9,
      resourceType: CardResource.MICROBE,

      action: {
        or: {
          autoSelect: true,
          behaviors: [{
            title: 'Spend 2 microbes here to raise Venus 1 step.',
            spend: {resourcesHere: 2},
            global: {venus: 1},
            // LogHelper.logRemoveResource(player, this, 2, 'raise oxygen 1 step');
          },
          {
            // Remove "Add a microbe to this card"
            title: 'Select a Venus card to add 1 microbe',
            addResourcesToAnyCard: {
              count: 1,
              tag: Tag.VENUS,
              type: CardResource.MICROBE,
              autoSelect: true,
            },
          }],
        },
      },

      requirements: {venus: 6},
      metadata: {
        cardNumber: '253',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 microbe to ANY Venus CARD.', (eb) => {
            eb.empty().startAction.resource(CardResource.MICROBE, {secondaryTag: Tag.VENUS});
          }).br;
          b.or().br;
          b.action('Remove 2 microbes to raise Venus 1 step', (eb) => {
            eb.resource(CardResource.MICROBE, 2).startAction.venus(1);
          });
        }),
        description: 'Requires Venus 6%',
      },
    });
  }
}
