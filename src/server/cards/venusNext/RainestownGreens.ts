import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class RainestownGreens extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.RAINESTOWN_GREENS,
      tags: [Tag.VENUS, Tag.VENUS],
      cost: 23,
      victoryPoints: {tag: Tag.VENUS},

      metadata: {
        cardNumber: '263',
        renderData: CardRenderer.builder((b) => {
          b.vpText('1 VP per Venus tag you have.');
        }),
        description: 'He doesnt mess up chips around the greens anymore',
      },
    });
  }
}
