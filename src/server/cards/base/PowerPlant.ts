import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class PowerPlant extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.POWER_PLANT,
      tags: [Tag.ENERGY, Tag.BUILDING],
      cost: 4,

      behavior: {
        production: {energy: 1},
      },

      metadata: {
        cardNumber: '141',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(1));
        }),
        description: 'Increase your energy production 1 step.',
      },
    });
  }
}

