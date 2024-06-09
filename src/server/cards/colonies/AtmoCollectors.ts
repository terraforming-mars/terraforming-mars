import {IProjectCard} from '../IProjectCard';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardResource} from '../../../common/CardResource';
import {Size} from '../../../common/cards/render/Size';
import {CardRenderer} from '../render/CardRenderer';
import {digit} from '../Options';
import {ActionCard} from '../ActionCard';

export class AtmoCollectors extends ActionCard implements IProjectCard {
  constructor() {
    super({
      cost: 15,
      name: CardName.ATMO_COLLECTORS,
      type: CardType.ACTIVE,
      resourceType: CardResource.FLOATER,

      behavior: {
        addResourcesToAnyCard: {type: CardResource.FLOATER, count: 2},
      },

      action: {
        or: {
          behaviors: [
            {
              title: 'Remove 1 floater to gain 2 titanium',
              spend: {resourcesHere: 1},
              stock: {titanium: 2},
            },
            {
              title: 'Remove 1 floater to gain 3 energy',
              spend: {resourcesHere: 1},
              stock: {energy: 3},
            },
            {
              title: 'Remove 1 floater to gain 4 heat',
              spend: {resourcesHere: 1},
              stock: {heat: 4},
            },
            {
              title: 'Add 1 floater to this card',
              addResources: 1,
            },
          ],
          autoSelect: true,
        },
      },

      metadata: {
        description: 'Add 2 floaters to ANY card.',
        cardNumber: 'C03',
        renderData: CardRenderer.builder((b) => {
          b.action('Add one floater here.', (eb) => {
            eb.empty().startAction.resource(CardResource.FLOATER).or(Size.SMALL);
          }).br;
          b.action('Spend 1 floater here to gain 2 titanium, or 3 energy, or 4 heat.', (eb) => {
            eb.resource(CardResource.FLOATER).startAction.titanium(2, {digit}).slash(Size.SMALL).energy(3, {digit}).slash(Size.SMALL).heat(4, {digit});
          }).br;
          b.resource(CardResource.FLOATER, 2).asterix();
        }),
      },
    });
  }
}
