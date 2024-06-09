import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {ActionCard} from '../ActionCard';
import {CardType} from '../../../common/cards/CardType';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {max} from '../Options';

export class Psychrophiles extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.PSYCHROPHILES,
      tags: [Tag.MICROBE],
      cost: 2,
      resourceType: CardResource.MICROBE,

      action: {
        addResources: 1,
      },

      requirements: {temperature: -20, max},
      metadata: {
        cardNumber: 'P39',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 microbe to this card.', (eb) => {
            eb.empty().startAction.resource(CardResource.MICROBE);
          }).br;
          b.effect('When paying for a plant card, microbes here may be used as 2 M€ each.', (eb) => {
            eb.tag(Tag.PLANT).startEffect.resource(CardResource.MICROBE).equals().megacredits(2);
          });
        }),
        description: 'Temperature must be -20 C or lower.',
      },
    });
  }
}
