import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class BuildingIndustries extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.BUILDING_INDUSTRIES,
      tags: [Tag.BUILDING],
      cost: 6,

      behavior: {
        production: {energy: -1, steel: 2},
      },

      metadata: {
        cardNumber: '065',
        description: 'Decrease your energy production 1 step and increase your steel production 2 steps.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(1).br;
            pb.plus().steel(2);
          });
        }),
      },
    });
  }
}
