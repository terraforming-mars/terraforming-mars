import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {ActionCard} from '../ActionCard';
import {CardType} from '../../../common/cards/CardType';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class Tardigrades extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.TARDIGRADES,
      tags: [Tag.MICROBE],
      cost: 4,

      resourceType: CardResource.MICROBE,
      victoryPoints: {resourcesHere: {}, per: 4},

      action: {
        addResources: 1,
      },

      metadata: {
        cardNumber: '049',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 microbe to this card.', (eb) => {
            eb.empty().startAction.resource(CardResource.MICROBE);
          }).br;
          b.vpText('1 VP per 4 Microbes on this card.');
        }),
      },
    });
  }
}
