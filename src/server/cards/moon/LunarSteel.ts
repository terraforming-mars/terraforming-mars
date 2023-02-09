import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {Card} from '../Card';

export class LunarSteel extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.LUNAR_STEEL,
      cardType: CardType.ACTIVE,
      tags: [Tag.MOON],
      cost: 5,

      behavior: {
        steelValue: 1,
      },

      metadata: {
        cardNumber: 'M87',
        renderData: CardRenderer.builder((b) => {
          b.effect('Your steel resources are worth 1 M€ extra.', (eb) => {
            eb.steel(1).startEffect.plus(Size.SMALL).megacredits(1);
          });
        }),
      },
    });
  }
}
