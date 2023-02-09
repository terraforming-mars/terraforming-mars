import {Tag} from '../../../common/cards/Tag';
import {PreludeCard} from './PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class BiosphereSupport extends PreludeCard {
  constructor() {
    super({
      name: CardName.BIOSPHERE_SUPPORT,
      tags: [Tag.PLANT],

      behavior: {
        production: {plants: 2, megacredits: -1},
      },

      metadata: {
        cardNumber: 'P05',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().megacredits(1).br;
            pb.plants(2);
          });
        }),
        description: 'Increase your plant production 2 steps. Decrease your M€ production 1 step.',
      },
    });
  }
}

