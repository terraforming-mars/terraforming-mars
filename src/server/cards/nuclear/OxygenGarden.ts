import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardResource} from '../../../common/CardResource';

export class OxygenGarden extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.OXYGEN_GARDEN,
      tags: [Tag.SCIENCE, Tag.PLANT,],
      cost: 17,
      tr: {oxygen: 1},

      behavior: {
        greenery: {},
        addResourcesToAnyCard: {count: 1, type: CardResource.MICROBE},
        stock: {plants: 1},
      },

      metadata: {
        cardNumber: 'N59',
        renderData: CardRenderer.builder((b) => {
          b.greenery().plants(1).microbes(1).asterix();
        }),
        description: 'Place a greenery tile and raise oxygen 1 step. Gain 1 plant. Add microbe to ANOTHER card.',
      },
    });
  }
}
