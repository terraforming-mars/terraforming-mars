import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {IProjectCard} from '../IProjectCard';

export class UnexpectedApplication extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.UNEXPECTED_APPLICATION,
      type: CardType.EVENT,
      tags: [Tag.VENUS],
      cost: 4,

      behavior: {
        spend: {cards: 1},
        global: {venus: 1},
      },

      metadata: {
        cardNumber: 'P86',
        renderData: CardRenderer.builder((b) => {
          b.minus().cards(1).venus(1);
        }),
        description: 'Discard 1 card to terraform Venus 1 step.',
      },
    });
  }
}
