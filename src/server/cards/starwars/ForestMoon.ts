import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {all} from '../Options';
import {CardResource} from '../../../common/CardResource';
import {Resource} from '../../../common/Resource';

export class ForestMoon extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.FOREST_MOON,
      tags: [Tag.PLANT, Tag.ANIMAL],
      cost: 15,
      requirements: {greeneries: 4, all},
      victoryPoints: 1,

      behavior: {
        decreaseAnyProduction: {count: 2, type: Resource.ENERGY},
        addResourcesToAnyCard: {count: 1, type: CardResource.ANIMAL},
      },

      metadata: {
        cardNumber: 'SW06',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.minus().energy(2, {all})).resource(CardResource.ANIMAL);
        }),
        description: 'Requires any 4 greeneries on Mars. Decrease any energy production 2 steps. Add an animal to any card.',
      },
    });
  }
}
