import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {Size} from '../../../common/cards/render/Size';

export class UndercoverActivists extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.UNDERCOVER_ACTIVISTS,
      cost: 15,
      tags: [Tag.PLANT],

      behavior: {
        stock: {plants: {greeneries: {}, all: false}},
        production: {megacredits: 1, plants: 1},

      },

      metadata: {
        cardNumber: 'N39',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {pb.megacredits(1).plants(1).br;
        });
          b.plants(1).slash().greenery(Size.MEDIUM, false);
      }),
        description: 'Increase your M€ production 1 step and your steel production 1 step. Gain 1 plant for each greenery tile you own.',
      },
    });
  }
}

