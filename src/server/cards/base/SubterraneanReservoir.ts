import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class SubterraneanReservoir extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
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

