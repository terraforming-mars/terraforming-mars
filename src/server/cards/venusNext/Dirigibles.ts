import {IActionCard} from '../ICard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {ActionCard} from '../ActionCard';

export class Dirigibles extends ActionCard implements IActionCard {
  constructor() {
    super({
      name: CardName.DIRIGIBLES,
      type: CardType.ACTIVE,
      tags: [Tag.VENUS],
      cost: 11,
      resourceType: CardResource.FLOATER,

      action: {
        addResourcesToAnyCard: {count: 1, type: CardResource.FLOATER, mustHaveCard: true},
      },

      metadata: {
        cardNumber: '222',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 floater to ANY card', (eb) => {
            eb.empty().startAction.resource(CardResource.FLOATER).asterix();
          }).br;
          b.effect('When playing a Venus tag, Floaters here may be used as payment, and are worth 3M€ each.', (eb) => {
            eb.tag(Tag.VENUS).startEffect.resource(CardResource.FLOATER).equals().megacredits(3);
          });
        }),
      },
    });
  }
}
