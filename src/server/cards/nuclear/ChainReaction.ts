/*import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {Size} from '../../../common/cards/render/Size';
import {digit} from '../Options';

export class ChainReaction extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.CHAIN_REACTION,
      cost: 11,
      tags: [Tag.POWER, Tag.BUILDING],
      victoryPoints: 1,

      behavior: {
        or: {
          behaviors: [
            {
              title: 'Increase your heat production 1 step.' ,
              production: {heat: 1},
              spend: {energy: 5},
              stock: {heat: 5},
            },
            {
              title: 'Increase your steel and titanium production 1 step.',
              production: {energy: 1},
              spend: {energy: 5},
              stock: {heat: 5},
            },
            {
              title: 'Place an ocean, and gain 2 steel and one titanium.',
              production: {energy: 1},
              spend: {heat: 5},
              stock: {energy:5},
            },
            {
              title: 'Place an ocean, and gain 2 steel and one titanium.',
              production: {heat: 1},
              spend: {heat: 5},
              stock: {energy:5},
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
*/