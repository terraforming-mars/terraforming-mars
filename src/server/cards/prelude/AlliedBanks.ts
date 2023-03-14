import {Tag} from '../../../common/cards/Tag';
import {PreludeCard} from './PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class AlliedBanks extends PreludeCard {
  constructor() {
    super({
      name: CardName.ALLIED_BANK,
      tags: [Tag.EARTH],

      behavior: {
        production: {megacredits: 4},
        stock: {megacredits: 3},
      },

      metadata: {
        cardNumber: 'P01',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(4)).br;
          b.megacredits(3);
        }),
        description: 'Increase your M€ production 4 steps. Gain 3 M€.',
      },
    });
  }
}

