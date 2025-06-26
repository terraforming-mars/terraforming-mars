import {IActionCard} from '../ICard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {ActionCard} from '../ActionCard';

export class FloatingHabs extends ActionCard implements IActionCard {
  constructor() {
    super({
      name: CardName.FLOATING_HABS,
      type: CardType.ACTIVE,
      tags: [Tag.VENUS],
      cost: 5,

      resourceType: CardResource.FLOATER,
      victoryPoints: {resourcesHere: {}, per: 2},

      action: {
        spend: {megacredits: 2},
        addResourcesToAnyCard: {type: CardResource.FLOATER, count: 1, autoSelect: true},
      },

      requirements: {tag: Tag.SCIENCE, count: 2},
      metadata: {
        cardNumber: '225',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 2 M€ to add 1 floater to ANY card', (eb) => {
            eb.megacredits(2).startAction.resource(CardResource.FLOATER).asterix();
          }).br;
          b.vpText('1 VP for every 2nd Floater on this card.');
        }),
        description: 'Requires 2 science tags.',
      },
    });
  }
}
