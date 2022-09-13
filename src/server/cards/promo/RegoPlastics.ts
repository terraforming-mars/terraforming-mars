import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';

export class RegoPlastics extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.REGO_PLASTICS,
      tags: [Tag.BUILDING],
      cost: 10,
      victoryPoints: 1,

      behavior: {
        steelValue: 1,
      },

      metadata: {
        cardNumber: 'X10',
        renderData: CardRenderer.builder((b) => {
          b.effect('Your steel resources are worth 1 M€ extra.', (eb) => {
            eb.steel(1).startEffect.plus(Size.SMALL).megacredits(1);
          });
        }),
      },
    });
  }
}
