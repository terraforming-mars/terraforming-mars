import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class PowerGrid extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.POWER_GRID,
      tags: [Tag.POWER],
      cost: 18,

      behavior: {
        production: {energy: {tag: Tag.POWER}},
      },

      metadata: {
        cardNumber: '102',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(1).slash().tag(Tag.POWER));
        }),
        description: 'Increase your energy production step for each power tag you have, including this.',
      },
    });
  }
}
