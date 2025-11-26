import {IProjectCard} from '@/server/cards/IProjectCard';
import {Card} from '@/server/cards/Card';
import {CardType} from '@/common/cards/CardType';
import {CardName} from '@/common/cards/CardName';
import {CardRenderer} from '@/server/cards/render/CardRenderer';

export class SubterraneanReservoir extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.SUBTERRANEAN_RESERVOIR,
      cost: 11,

      behavior: {
        ocean: {},
      },

      metadata: {
        cardNumber: '127',
        renderData: CardRenderer.builder((b) => {
          b.oceans(1);
        }),
        description: 'Place 1 ocean tile.',
      },
    });
  }
}

