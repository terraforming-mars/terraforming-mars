import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {played} from '../Options';

export class Shuttles extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.SHUTTLES,
      tags: [Tag.SPACE],
      cost: 10,
      victoryPoints: 1,

      behavior: {
        production: {energy: -1, megacredits: 2},
      },

      requirements: CardRequirements.builder((b) => b.oxygen(5)),
      cardDiscount: {tag: Tag.SPACE, amount: 2},
      metadata: {
        cardNumber: '166',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you play a Space card, you pay 2 M€ less for it.', (eb) => {
            eb.space({played}).startEffect.megacredits(-2);
          }).br;
          b.production((pb) => {
            pb.minus().energy(1).nbsp;
            pb.plus().megacredits(2);
          });
        }),
        description: {
          text: 'Requires 5% oxygen. Decrease your energy production 1 step and increase your M€ production 2 steps.',
          align: 'left',
        },
      },
    });
  }
}
