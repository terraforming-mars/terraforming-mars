import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {TileType} from '../../../common/TileType';
import {Card} from '../Card';

export class LunarDustProcessingPlant extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.LUNAR_DUST_PROCESSING_PLANT,
      cardType: CardType.ACTIVE,
      tags: [Tag.BUILDING],
      cost: 6,
      reserveUnits: {titanium: 1},

      behavior: {
        moon: {logisticsRate: 1},
      },

      metadata: {
        description: 'Spend 1 titanium. Raise the Logistic Rate 1 step.',
        cardNumber: 'M17',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you place a road tile on The Moon, you spend no steel on it.', (eb) => {
            eb.startEffect.tile(TileType.MOON_ROAD, false).colon().text('0').steel(1);
          }).br;
          b.minus().titanium(1).moonLogisticsRate();
        }),
      },
    });
  }
}
