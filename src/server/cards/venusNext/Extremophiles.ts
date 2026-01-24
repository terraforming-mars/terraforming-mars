import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {ActionCard} from '../ActionCard';

export class Extremophiles extends ActionCard {
  constructor() {
    super({
      name: CardName.EXTREMOPHILES,
      type: CardType.ACTIVE,
      tags: [Tag.VENUS, Tag.MICROBE],
      cost: 3,
      resourceType: CardResource.MICROBE,
      victoryPoints: {resourcesHere: {}, per: 3},

      action: {
        addResourcesToAnyCard: {type: CardResource.MICROBE, count: 1},
      },

      requirements: {tag: Tag.SCIENCE, count: 2},
      metadata: {
        cardNumber: '224',
        description: 'Requires 2 science tags.',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 microbe to ANY card.', (eb) => {
            eb.empty().startAction.resource(CardResource.MICROBE).asterix();
          }).br;
          b.vpText('1 VP for every 3rd Microbe on this card.');
        }),
      },
    });
  }
}
