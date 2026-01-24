import {PreludeCard} from './PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class SocietySupport extends PreludeCard {
  constructor() {
    super({
      name: CardName.SOCIETY_SUPPORT,

      behavior: {
        production: {plants: 1, energy: 1, heat: 1, megacredits: -1},
      },

      metadata: {
        cardNumber: 'P31',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.megacredits(-1).plants(1).br;
            pb.energy(1).heat(1);
          });
        }),
        description: 'Increase your plant, energy and heat production 1 step. Decrease M€ production 1 step.',
      },
    });
  }
}
