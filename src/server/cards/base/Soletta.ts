import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class Soletta extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.SOLETTA,
      tags: [Tag.SPACE],
      cost: 35,

      behavior: {
        production: {heat: 7},
      },

      metadata: {
        cardNumber: '203',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.heat(7));
        }),
        description: 'Increase your heat production 7 steps.',
      },
    });
  }
}
