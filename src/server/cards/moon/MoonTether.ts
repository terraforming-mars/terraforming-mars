import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class MoonTether extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.MOON_TETHER,
      type: CardType.ACTIVE,
      tags: [Tag.MOON, Tag.SPACE],
      cost: 18,
      victoryPoints: 1,

      requirements: {tag: Tag.SPACE, count: 6},
      cardDiscount: {amount: 2},
      metadata: {
        cardNumber: 'M90',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you play a card, you pay 2 M€ less for it.', (eb) => {
            eb.empty().startEffect.megacredits(-2);
          }).br;
        }),
        description: 'Requires 6 space tags.',
      },
    });
  }
}
