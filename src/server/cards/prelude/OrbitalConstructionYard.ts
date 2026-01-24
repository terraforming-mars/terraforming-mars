import {Tag} from '../../../common/cards/Tag';
import {PreludeCard} from './PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class OrbitalConstructionYard extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.ORBITAL_CONSTRUCTION_YARD,
      tags: [Tag.SPACE],

      behavior: {
        production: {titanium: 1},
        stock: {titanium: 4},
      },

      metadata: {
        cardNumber: 'P25',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.titanium(1)).br;
          b.titanium(4);
        }),
        description: 'Increase your titanium production 1 step. Gain 4 titanium.',
      },
    });
  }
}
