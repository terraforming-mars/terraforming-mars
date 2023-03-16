import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardResource} from '../../../common/CardResource';

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
        renderData: CardRenderer.builder((b) => b.data({amount: 5}).asterix()),
        description: 'Add 5 data to ANY card.',
      },
    });
  }
}
