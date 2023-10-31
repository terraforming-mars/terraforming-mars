import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';

export class LobbyingNetwork extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.LOBBYING_NETWORK,
      tags: [Tag.EARTH],
      cost: 5,

      behavior: {
        underworld: {corruption: 1},
      },

      metadata: {
        cardNumber: 'U31',
        renderData: CardRenderer.builder((b) => {
          b.corruption(1);
        }),
        description: 'Gain 1 corruption.',
      },
    });
  }
}
