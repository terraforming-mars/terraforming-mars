import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';

export class UndergroundAmusementPark extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.UNDERGROUND_AMUSEMENT_PARK,
      tags: [Tag.BUILDING],
      cost: 5,

      requirements: {excavation: 1},

      behavior: {
        production: {megacredits: 1},
      },

      metadata: {
        cardNumber: 'U19',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(1));
        }),
        description: 'Requires an excavation marker. Increase your M€ production 1 step.',
      },
    });
  }
}
