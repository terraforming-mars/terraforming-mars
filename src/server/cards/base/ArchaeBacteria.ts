import {IProjectCard} from '@/server/cards/IProjectCard';
import {Tag} from '@/common/cards/Tag';
import {Card} from '@/server/cards/Card';
import {CardType} from '@/common/cards/CardType';
import {CardName} from '@/common/cards/CardName';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {max} from '@/server/cards/Options';

export class ArchaeBacteria extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.ARCHAEBACTERIA,
      tags: [Tag.MICROBE],
      cost: 6,

      behavior: {
        production: {plants: 1},
      },

      requirements: {temperature: -18, max},
      metadata: {
        description: 'It must be -18 C or colder. Increase your plant production 1 step.',
        cardNumber: '042',
        renderData: CardRenderer.builder((b) => b.production((pb) => pb.plants(1))),
      },
    });
  }
}
