import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';

export class OrbitalLaboratories extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.ORBITAL_LABORATORIES,
      cost: 18,
      tags: [Tag.SCIENCE, Tag.PLANT, Tag.SPACE],

      behavior: {
        production: {plants: 2},
        stock: {plants: 1},
      },

      metadata: {
        cardNumber: 'Pf07',
        renderData: CardRenderer.builder((b) => {
          b.production(((pb) => pb.plants(2))).nbsp.plants(1);
        }),
        description: 'Increase your plant production 2 steps. Gain 1 plant.',
      },
    });
  }
}

