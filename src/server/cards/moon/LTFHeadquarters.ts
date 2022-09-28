import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {IProjectCard} from '../IProjectCard';

export class LTFHeadquarters extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.LTF_HEADQUARTERS,
      cardType: CardType.AUTOMATED,
      tags: [Tag.SPACE],
      cost: 31,

      behavior: {
        moon: {habitatRate: 1},
        colonies: {
          buildColony: {},
          addTradeFleet: 1,
        },
      },

      metadata: {
        description: 'Raise the Habitat Rate 1 step. Place a colony. Gain 1 trade fleet.',
        cardNumber: 'M79',
        renderData: CardRenderer.builder((b) => {
          b.moonHabitatRate().colonies(1).tradeFleet();
        }),
      },
    });
  }
}
