import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';

export class HydrogenBombardment extends PreludeCard {
  constructor() {
    super({
      name: CardName.HYDROGEN_BOMBARDMENT,
      tags: [Tag.SPACE, Tag.VENUS],
      behavior: {
        production: {titanium: 1},
        global: {venus: 1},
        stock: {megacredits: 6},
      },

      metadata: {
        cardNumber: 'PfP04',
        renderData: CardRenderer.builder((b) => {
          b.venus(1).br;
          b.production((pb) => pb.titanium(1)).br;
          b.megacredits(6);
        }),
        description: 'Increase the Venus scale 1 step. Increase your titanium production 1 step. Gain 6 M€.',
      },
    });
  }
}

