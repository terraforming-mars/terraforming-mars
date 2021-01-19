import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {CardRenderer} from '../render/CardRenderer';
import {TileType} from '../../TileType';
import {Units} from '../../Units';
import {Card} from '../Card';

export class LunarDustProcessingPlant extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.LUNAR_DUST_PROCESSING_PLANT,
      cardType: CardType.ACTIVE,
      tags: [Tags.BUILDING],
      cost: 6,
      productionDelta: Units.of({}),

      metadata: {
        description: 'Spend 1 titanium. Raise Logistic Rate 1 step.',
        cardNumber: 'M17',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you place a road tile on the Moon, you spend no steel on it.', (eb) => {
            eb.empty().startEffect.tile(TileType.MOON_ROAD, false).colon().steel(0).asterix();
          }).br;
          b.minus().titanium(1).moonLogisticsRate(1);
        }),
      },
    });
  };

  public reserveUnits = Units.of({titanium: 1});

  public play(player: Player) {
    Units.deductUnits(this.reserveUnits, player);
    MoonExpansion.raiseLogisticRate(player);
    return undefined;
  }
}
