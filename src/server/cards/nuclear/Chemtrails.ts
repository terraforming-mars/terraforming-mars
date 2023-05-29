import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class Chemtrails extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.CHEMTRAILS,
      tags: [Tag.SPACE],
      cost: 16,

      behavior: {
        global: {oxygen: 1},
        production: {titanium: 1},
        stock: {steel: 1, titanium: 1},
      },

      metadata: {
        cardNumber: 'N06',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.titanium(1)).steel(1).titanium(1).oxygen(1);
        }),
        description: 'Increase your titanium production 1 step. Gain 1 steel and 1 titanium. Raise oxygen 1 step.',
      },
    });
  }
}
