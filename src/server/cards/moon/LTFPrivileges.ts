import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class LTFPrivileges extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.LTF_PRIVILEGES,
      cardType: CardType.ACTIVE,
      tags: [Tag.MOON],
      cost: 21,

      metadata: {
        cardNumber: 'M82',
        renderData: CardRenderer.builder((b) => {
          b.effect('When playing a Moon tag, you do not pay additional steel or titanium for playing it.',
            (eb) => {
              eb.moon().startEffect.text('0').steel(1).nbsp.text('0').titanium(1);
            });
        }),
      },
    });
  }
}
