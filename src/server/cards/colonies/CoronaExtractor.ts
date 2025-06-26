import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {digit} from '../Options';

export class CoronaExtractor extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.CORONA_EXTRACTOR,
      cost: 10,
      tags: [Tag.SPACE, Tag.POWER],

      behavior: {
        production: {energy: 4},
      },

      requirements: {tag: Tag.SCIENCE, count: 4},
      metadata: {
        cardNumber: 'C06',
        description: 'Requires 4 science tags. Increase your energy production 4 steps.',
        renderData: CardRenderer.builder((b) => b.production((pb) => pb.energy(4, {digit}))),
      },
    });
  }
}
