import {IActionCard} from '../ICard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {ActionCard} from '../ActionCard';

export class LocalShading extends ActionCard implements IActionCard {
  constructor() {
    super({
      name: CardName.LOCAL_SHADING,
      type: CardType.ACTIVE,
      tags: [Tag.VENUS],
      cost: 4,
      resourceType: CardResource.FLOATER,

      action: {
        or: {
          behaviors: [
            {
              spend: {resourcesHere: 1},
              production: {megacredits: 1},
              title: 'Remove 1 floater to increase M€ production 1 step',
            },
            {
              addResources: 1,
              title: 'Add 1 floater to this card',
            },
          ],
          autoSelect: true,
        },
      },

      metadata: {
        cardNumber: '235',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 floater to this card.', (eb) => {
            eb.empty().startAction.resource(CardResource.FLOATER);
          }).br;
          b.or().br;
          b.action('Spend 1 floater here to raise your M€ production 1 step.', (eb) => {
            eb.resource(CardResource.FLOATER).startAction.production((pb) => pb.megacredits(1));
          });
        }),
      },
    });
  }
}
