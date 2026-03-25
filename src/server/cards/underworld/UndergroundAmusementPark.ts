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
      victoryPoints: 1,

      requirements: {undergroundTokens: 1},

      behavior: {
        production: {megacredits: 1},
      },

      metadata: {
        cardNumber: 'U019',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(1));
        }),
        description: 'Requires you have 1 underground token. Increase your M€ production 1 step.',
      },
    });
  }
}
