import {Tag} from '@/common/cards/Tag';
import {CardType} from '@/common/cards/CardType';
import {CardName} from '@/common/cards/CardName';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {Card} from '@/server/cards/Card';
import {IProjectCard} from '@/server/cards/IProjectCard';

export class VenusWaystation extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.VENUS_WAYSTATION,
      type: CardType.ACTIVE,
      tags: [Tag.VENUS, Tag.SPACE],
      cost: 9,
      victoryPoints: 1,

      cardDiscount: {tag: Tag.VENUS, amount: 2},
      metadata: {
        cardNumber: '258',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you play a Venus tag, you pay 2 M€ less for it.', (eb)=> {
            eb.tag(Tag.VENUS).startEffect.megacredits(-2);
          });
        }),
      },
    });
  }
}
