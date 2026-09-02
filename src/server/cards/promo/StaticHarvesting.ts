import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class StaticHarvesting extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.STATIC_HARVESTING,
      tags: [Tag.POWER],
      cost: 5,

      behavior: {
        production: {energy: 1},
        stock: {megacredits: {tag: Tag.BUILDING}},
      },

      requirements: {
        oceans: 3,
        max: true,
      },

      metadata: {
        cardNumber: 'X74',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(1)).br;
          b.megacredits(1).slash().tag(Tag.BUILDING);
        }),
        description: 'Requires 3 or fewer ocean tiles. Increase your energy production 1 step. Gain 1 M€ per building tag you have.',
      },
    });
  }
}
