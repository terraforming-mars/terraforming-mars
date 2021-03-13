import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {CardRenderItemSize} from '../render/CardRenderItemSize';
import {IProjectCard} from '../IProjectCard';
import {CardRequirements} from '../CardRequirements';

export class LunarSecurityStations extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.LUNAR_SECURITY_STATIONS,
      cardType: CardType.ACTIVE,
      cost: 9,
      requirements: CardRequirements.builder((b) => b.roadTiles(3).any()),

      metadata: {
        description: 'Requires 3 road tiles on the Moon. Raise the Logistic Rate 1 step.',
        cardNumber: 'M42',
        renderData: CardRenderer.builder((b) => {
          b.moonLogisticsRate();
          b.text('Opponents may not remove your', CardRenderItemSize.SMALL, true).br;
          b.steel(1).titanium(1).production((pb) => pb.steel(1)).production((pb) => pb.titanium(1));
        }),
      },
    });
  };

  public play(player: Player) {
    MoonExpansion.raiseLogisticRate(player);
    return undefined;
  }
}
