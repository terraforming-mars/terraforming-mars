import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class GeothermalPower extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.GEOTHERMAL_POWER,
      tags: [Tag.ENERGY, Tag.BUILDING],
      cost: 11,

      behavior: {
        production: {energy: 2},
      },

      metadata: {
        cardNumber: '117',
        renderData: CardRenderer.builder((b) => b.production((pb) => pb.energy(2))),
        description: 'Increase your energy production 2 steps.',
      },
    });
  }
}
