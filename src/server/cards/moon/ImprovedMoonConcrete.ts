import {CardName} from '@/common/cards/CardName';
import {CardType} from '@/common/cards/CardType';
import {IProjectCard} from '@/server/cards/IProjectCard';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {Card} from '@/server/cards/Card';
import {Tag} from '@/common/cards/Tag';

export class ImprovedMoonConcrete extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.IMPROVED_MOON_CONCRETE,
      type: CardType.ACTIVE,
      tags: [Tag.MOON],
      cost: 12,
      reserveUnits: {steel: 2},

      behavior: {
        moon: {miningRate: 1},
      },

      metadata: {
        description: 'Spend 2 steel. Raise the mining rate 1 step.',
        cardNumber: 'M37',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you build a mine on The Moon, you spend 1 titanium less.', (eb) => {
            eb.moonMine().startEffect.minus().titanium(1);
          }).br;
          b.minus().steel(2).moonMiningRate();
        }),
      },
    });
  }
}
