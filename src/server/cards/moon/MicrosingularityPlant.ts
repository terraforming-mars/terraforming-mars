import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {all} from '../Options';
import {IProjectCard} from '../IProjectCard';

export class MicrosingularityPlant extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.MICROSINGULARITY_PLANT,
      type: CardType.AUTOMATED,
      tags: [Tag.POWER],
      cost: 10,
      requirements: {habitatTiles: 2, all},

      behavior: {
        production: {energy: 2},
      },

      metadata: {
        description: 'Requires 2 habitats on The Moon. Increase your energy production 2 steps.',
        cardNumber: 'M40',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(2));
        }),
      },
    });
  }
}
