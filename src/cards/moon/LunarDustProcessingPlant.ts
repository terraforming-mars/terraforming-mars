import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardMetadata} from '../CardMetadata';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {CardRenderer} from '../render/CardRenderer';
import {TileType} from '../../TileType';
import {Units} from '../../Units';

export class LunarDustProcessingPlant implements IProjectCard {
  public cost = 6;
  public tags = [Tags.BUILDING];
  public cardType = CardType.ACTIVE;
  public name = CardName.LUNAR_DUST_PROCESSING_PLANT;
  public reserveUnits = Units.of({titanium: 1});

  public play(player: Player) {
    MoonExpansion.raiseLogisticRate(player);
    return undefined;
  }

  public readonly metadata: CardMetadata = {
    description: 'Spend 1 titanium. Raise Logistic Rate 1 step.',
    cardNumber: 'M17',
    renderData: CardRenderer.builder((b) => {
      b.effect('When you place a road tile on the Moon, you spend no steel on it.', (eb) => {
        eb.empty().startEffect.tile(TileType.MOON_ROAD, false).colon().steel(0).asterix();
      }).br;
      b.minus().titanium(1).moonLogisticsRate(1);
    }),
  };
}
