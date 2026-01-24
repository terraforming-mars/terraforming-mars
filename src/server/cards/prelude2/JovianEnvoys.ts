import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';

export class JovianEnvoys extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.JOVIAN_ENVOYS,
      cost: 2,
      requirements: {tag: Tag.JOVIAN, count: 2},

      behavior: {
        turmoil: {sendDelegates: {count: 2}},
      },

      metadata: {
        cardNumber: 'P77',
        renderData: CardRenderer.builder((b) => b.delegates(2).asterix),
        description: 'Requires 2 Jovian tags. Place 2 delegates in 1 party.',
      },
    });
  }
}
