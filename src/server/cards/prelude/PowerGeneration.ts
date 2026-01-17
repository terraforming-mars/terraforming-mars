import {Tag} from '@/common/cards/Tag';
import {PreludeCard} from '@/server/cards/prelude/PreludeCard';
import {IProjectCard} from '@/server/cards/IProjectCard';
import {CardName} from '@/common/cards/CardName';
import {CardRenderer} from '@/server/cards/render/CardRenderer';

export class PowerGeneration extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.POWER_GENERATION,
      tags: [Tag.POWER],

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
