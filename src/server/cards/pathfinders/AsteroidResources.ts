import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {Size} from '../../../common/cards/render/Size';
import {digit} from '../Options';

export class AsteroidResources extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.ASTEROID_RESOURCES,
      cost: 17,
      tags: [Tag.JOVIAN, Tag.SPACE],
      reserveUnits: {energy: 3},
      victoryPoints: 1,

      behavior: {
        or: {
          autoSelect: true,
          behaviors: [
            {
              title: 'Increase your steel and titanium production 1 step.',
              spend: {energy: 3},
              production: {steel: 1, titanium: 1},
            },
            {
              title: 'Place an ocean, and gain 2 steel and one titanium.',
              spend: {energy: 3},
              ocean: {},
              stock: {steel: 2, titanium: 1},
            },
          ],
        },
      },

      metadata: {
        cardNumber: 'Pf40',
        renderData: CardRenderer.builder((b) => {
          b.minus().energy(3, {digit}).production((pb) => pb.steel(1).titanium(1)).br
            .or(Size.SMALL).br;
          b.minus().energy(3, {digit}).oceans(1, {size: Size.SMALL}).steel(2, {digit}).titanium(1);
        }),
        description: 'Spend 3 energy. Either increase your steel and titanium production one step, OR ' +
          'place an ocean, and gain 2 steel and one titanium.',
      },
    });
  }
}
