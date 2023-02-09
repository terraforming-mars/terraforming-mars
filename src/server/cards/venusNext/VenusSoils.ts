import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {IProjectCard} from '../IProjectCard';

export class VenusSoils extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.VENUS_SOILS,
      cardType: CardType.AUTOMATED,
      tags: [Tag.VENUS, Tag.PLANT],
      cost: 20,

      behavior: {
        production: {plants: 1},
        global: {venus: 1},
        addResourcesToAnyCard: {count: 2, type: CardResource.MICROBE},
      },

      metadata: {
        cardNumber: '257',
        renderData: CardRenderer.builder((b) => {
          b.venus(1).br;
          b.production((pb) => pb.plants(1)).microbes(2).asterix();
        }),
        description: 'Raise Venus 1 step. Increase your plant production 1 step. Add 2 microbes to ANOTHER card',
      },
    });
  }
}
