import {Tag} from '../../../common/cards/Tag';
import {PreludeCard} from './PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class PowerGeneration extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.POWER_GENERATION,
      tags: [Tag.ENERGY],

      behavior: {
        production: {energy: 3},
      },

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
