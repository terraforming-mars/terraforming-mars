import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';

export class RichDeposits extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.RICH_DEPOSITS,
      cost: 12,

      behavior: {
        production: {steel: 3},
      },

      requirements: {tag: Tag.SCIENCE, count: 2},
      metadata: {
        cardNumber: 'Pf52',
        renderData: CardRenderer.builder((b) => b.production((pb) => pb.steel(3))),
        description: 'Requires 2 science tags. Increase your steel production 3 steps.',
      },
    });
  }
}
