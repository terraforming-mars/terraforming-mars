import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class CopernicusSolarArrays extends Card {
  constructor() {
    super({
      name: CardName.COPERNICUS_SOLAR_ARRAYS,
      cardType: CardType.AUTOMATED,
      tags: [Tag.ENERGY, Tag.SPACE],
      cost: 8,
      reserveUnits: {titanium: 1},

      behavior: {
        production: {energy: 1},
        stock: {heat: 2},
      },

      metadata: {
        description: 'Spend 1 titanium. Gain 2 heat. Incease your energy production 1 step.',
        cardNumber: 'M44',
        renderData: CardRenderer.builder((b) => {
          b.minus().titanium(1);
          b.br;
          b.heat(2);
          b.br;
          b.production((pb) => pb.energy(1));
        }),
      },
    });
  }
}
