import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class Mine extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.MINE,
      tags: [Tag.BUILDING],
      cost: 4,

      behavior: {
        production: {steel: 1},
      },

      metadata: {
        description: 'Increase your steel production 1 step.',
        cardNumber: '056',
        renderData: CardRenderer.builder((b) => b.production((pb) => pb.steel(1))),
      },
    });
  }
}
