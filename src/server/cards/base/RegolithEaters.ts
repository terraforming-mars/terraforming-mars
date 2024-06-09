import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {ActionCard} from '../ActionCard';
import {CardType} from '../../../common/cards/CardType';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class RegolithEaters extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.REGOLITH_EATERS,
      tags: [Tag.SCIENCE, Tag.MICROBE],
      cost: 13,
      resourceType: CardResource.MICROBE,

      action: {
        or: {
          autoSelect: true,
          behaviors: [{
            title: 'Remove 2 microbes to raise oxygen level 1 step',
            spend: {resourcesHere: 2},
            global: {oxygen: 1},
            // LogHelper.logRemoveResource(player, this, 2, 'raise oxygen 1 step');
          },
          {
            title: 'Add 1 microbe to this card',
            addResources: 1,
          }],
        },
      },

      metadata: {
        cardNumber: '033',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 microbe to this card.', (eb) => {
            eb.empty().startAction.resource(CardResource.MICROBE);
          }).br;
          b.or().br;
          b.action('Remove 2 microbes from this card to raise oxygen level 1 step.', (eb) => {
            eb.resource(CardResource.MICROBE, 2).startAction.oxygen(1);
          }).br;
        }),
      },
    });
  }
}
