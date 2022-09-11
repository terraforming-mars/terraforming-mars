import {Tag} from '../../../common/cards/Tag';
import {PreludeCard} from './PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class PolarIndustries extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.POLAR_INDUSTRIES,
      tags: [Tag.BUILDING],

      behavior: {
        production: {heat: 2},
        ocean: {},
      },

      metadata: {
        cardNumber: 'P26',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.heat(2)).br;
          b.oceans(1);
        }),
        description: 'Increase your heat production 2 steps. Place an Ocean tile.',
      },
    });
  }
}
