import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {CardRenderer} from '../render/CardRenderer';
import {TileType} from '../../TileType';
import {Units} from '../../Units';
import {MoonCard} from './MoonCard';

export class LunarDustProcessingPlant extends MoonCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.LUNAR_DUST_PROCESSING_PLANT,
      cardType: CardType.ACTIVE,
      tags: [Tags.BUILDING],
      cost: 6,
      productionBox: Units.of({}),
      reserveUnits: Units.of({titanium: 1}),

      metadata: {
        description: 'Spend 1 titanium. Raise the Logistic Rate 1 step.',
        cardNumber: 'M17',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you place a road tile on the Moon, you spend no steel on it.', (eb) => {
            eb.startEffect.tile(TileType.MOON_ROAD, false).colon().text('0').steel(1);
          }).br;
          b.minus().titanium(1).moonLogisticsRate();
        }),
      },
    });
  };


  public play(player: Player) {
    super.play(player);
    MoonExpansion.raiseLogisticRate(player);
    return undefined;
  }
}
