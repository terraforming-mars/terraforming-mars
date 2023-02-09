import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class TowingAComet extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.TOWING_A_COMET,
      tags: [Tag.SPACE],
      cost: 23,

      behavior: {
        stock: {plants: 2},
        global: {oxygen: 1},
        ocean: {},
      },

      metadata: {
        cardNumber: '075',
        renderData: CardRenderer.builder((b) => {
          b.oxygen(1).oceans(1).br;
          b.plants(2);
        }),
        description: 'Gain 2 plants. Raise oxygen level 1 step and place an ocean tile.',
      },
    });
  }
}
