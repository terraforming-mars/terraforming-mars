import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class SolarPower extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.SOLAR_POWER,
      tags: [Tag.ENERGY, Tag.BUILDING],
      cost: 11,

      behavior: {
        production: {energy: 1},
      },
      victoryPoints: 1,

      metadata: {
        cardNumber: '113',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(1));
        }),
        description: 'Increase your energy production 1 step.',
      },
    });
  }
}
