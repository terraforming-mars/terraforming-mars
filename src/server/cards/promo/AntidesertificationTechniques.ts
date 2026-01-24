import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';

export class AntidesertificationTechniques extends PreludeCard {
  constructor() {
    super({
      name: CardName.ANTI_DESERTIFICATION_TECHNIQUES,
      tags: [Tag.MICROBE, Tag.PLANT],

      behavior: {
        production: {plants: 1, steel: 1},
        stock: {megacredits: 3},
      },

      metadata: {
        cardNumber: 'X49',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(3).br;
          b.production((pb) => pb.plants(1).steel(1));
        }),
        description: 'Gain 3 M€. Increase your plant production 1 step and your steel production 1 step.',
      },
    });
  }
}

