import {IProjectCard} from '@/server/cards/IProjectCard';
import {Tag} from '@/common/cards/Tag';
import {Card} from '@/server/cards/Card';
import {CardType} from '@/common/cards/CardType';
import {CardName} from '@/common/cards/CardName';
import {CardRenderer} from '@/server/cards/render/CardRenderer';

export class ImportedGHG extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.IMPORTED_GHG,
      tags: [Tag.EARTH, Tag.SPACE],
      cost: 7,

      behavior: {
        production: {heat: 1},
        stock: {heat: 3},
      },

      metadata: {
        cardNumber: '162',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.heat(1)).heat(3);
        }),
        description: 'Increase your heat production 1 step and gain 3 heat.',
      },
    });
  }
}

