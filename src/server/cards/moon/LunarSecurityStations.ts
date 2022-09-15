import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Size} from '../../../common/cards/render/Size';
import {IProjectCard} from '../IProjectCard';
import {CardRequirements} from '../CardRequirements';
import {all} from '../Options';

export class LunarSecurityStations extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.LUNAR_SECURITY_STATIONS,
      cardType: CardType.ACTIVE,
      cost: 9,
      requirements: CardRequirements.builder((b) => b.roadTiles(3, {all})),

      behavior: {
        moon: {logisticsRate: 1},
      },

      metadata: {
        description: 'Requires 3 road tiles on The Moon. Raise the Logistic Rate 1 step.',
        cardNumber: 'M42',
        renderData: CardRenderer.builder((b) => {
          b.text('Opponents may not remove your', Size.SMALL, true).br;
          b.steel(1).titanium(1).production((pb) => pb.steel(1).titanium(1)).br;
          b.moonLogisticsRate();
        }),
      },
    });
  }
}
