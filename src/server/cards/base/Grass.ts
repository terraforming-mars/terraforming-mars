import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class Grass extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.GRASS,
      tags: [Tag.PLANT],
      cost: 11,

      behavior: {
        production: {plants: 1},
        stock: {plants: 3},
      },

      requirements: CardRequirements.builder((b) => b.temperature(-16)),
      metadata: {
        cardNumber: '087',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.plants(1)).plants(3);
        }),
        description: 'Requires -16° C or warmer. Increase your plant production 1 step. Gain 3 plants.',
      },
    });
  }
}
