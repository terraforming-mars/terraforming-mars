import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class WarpDrive extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 14,
      tags: [Tag.SCIENCE],
      name: CardName.WARP_DRIVE,
      type: CardType.ACTIVE,
      victoryPoints: 2,

      requirements: {tag: Tag.SCIENCE, count: 5},
      cardDiscount: {tag: Tag.SPACE, amount: 4},
      metadata: {
        cardNumber: 'C49',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you play a space card, you pay 4 M€ less for it.', (eb) => {
            eb.tag(Tag.SPACE).startEffect.megacredits(-4);
          });
        }),
        description: 'Requires 5 science tags.',
      },
    });
  }
}
