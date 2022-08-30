import {Tag} from '../../../common/cards/Tag';
import {PreludeCard2} from './PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class PowerGeneration extends PreludeCard2 implements IProjectCard {
  constructor() {
    super({
      name: CardName.POWER_GENERATION,
      tags: [Tag.ENERGY],
      productionBox: {energy: 3},

      metadata: {
        cardNumber: 'P27',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(3));
        }),
        description: 'Increase your energy production 3 steps.',
      },
    });
  }
}
