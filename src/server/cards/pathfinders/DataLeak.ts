import {IProjectCard} from '@/server/cards/IProjectCard';
import {Card} from '@/server/cards/Card';
import {CardType} from '@/common/cards/CardType';
import {CardName} from '@/common/cards/CardName';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {CardResource} from '@/common/CardResource';

export class DataLeak extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.DATA_LEAK,
      cost: 5,

      behavior: {
        addResourcesToAnyCard: {count: 5, type: CardResource.DATA},
      },

      metadata: {
        cardNumber: 'Pf30',
        renderData: CardRenderer.builder((b) => b.resource(CardResource.DATA, 5).asterix()),
        description: 'Add 5 data to ANY card.',
      },
    });
  }
}
