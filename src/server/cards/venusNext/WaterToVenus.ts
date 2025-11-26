import {Tag} from '@/common/cards/Tag';
import {CardType} from '@/common/cards/CardType';
import {CardName} from '@/common/cards/CardName';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {Card} from '@/server/cards/Card';
import {IProjectCard} from '@/server/cards/IProjectCard';

export class WaterToVenus extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.WATER_TO_VENUS,
      type: CardType.EVENT,
      tags: [Tag.SPACE],
      cost: 9,

      behavior: {
        global: {venus: 1},
      },

      metadata: {
        cardNumber: '254',
        renderData: CardRenderer.builder((b) => b.venus(1)),
        description: 'Raise Venus 1 step.',
      },
    });
  }
}
