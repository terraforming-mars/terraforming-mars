import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class SpaceStation extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.SPACE_STATION,
      tags: [Tag.SPACE],
      cost: 10,
      victoryPoints: 1,

      cardDiscount: {tag: Tag.SPACE, amount: 2},
      metadata: {
        cardNumber: '025',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you play a space card, you pay 2 M€ less for it.', (eb) => {
            eb.tag(Tag.SPACE).startEffect.megacredits(-2);
          });
        }),
      },
    });
  }
}
