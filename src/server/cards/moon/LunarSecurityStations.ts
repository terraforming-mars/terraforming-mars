import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Size} from '../../../common/cards/render/Size';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {all, uppercase} from '../Options';

export class LunarSecurityStations extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.LUNAR_SECURITY_STATIONS,
      type: CardType.ACTIVE,
      tags: [Tag.MOON],
      cost: 9,
      requirements: {roadTiles: 3, all},

      behavior: {
        moon: {logisticRate: 1},
      },

      metadata: {
        description: 'Requires 3 road tiles on The Moon. Raise the logistic rate 1 step.',
        cardNumber: 'M42',
        renderData: CardRenderer.builder((b) => {
          b.text('Opponents may not remove your', {size: Size.SMALL, uppercase}).br;
          b.steel(1).titanium(1).production((pb) => pb.steel(1).titanium(1)).br;
          b.moonLogisticRate();
        }),
      },
    });
  }
}
