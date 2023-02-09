import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {Size} from '../../../common/cards/render/Size';

export class PrivateSecurity extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.PRIVATE_SECURITY,
      cost: 8,
      tags: [Tag.EARTH],

      metadata: {
        cardNumber: 'Pf25',
        renderData: CardRenderer.builder((b) => {
          b.text('Opponents may not remove your basic resource production', Size.SMALL, true).br;
          b.production((pb) => pb.wild(1, {cancelled: true}));
        }),
      },
    });
  }
}

