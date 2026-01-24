import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';

export class EnvoysFromVenus extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.ENVOYS_FROM_VENUS,
      cost: 1,
      tags: [Tag.VENUS],
      requirements: {tag: Tag.VENUS, count: 3},

      behavior: {
        turmoil: {sendDelegates: {count: 2}},
      },

      metadata: {
        cardNumber: 'P72',
        renderData: CardRenderer.builder((b) => b.delegates(2).asterix),
        description: 'Requires 3 Venus tags. Place 2 delegates in 1 party.',
      },
    });
  }
}

