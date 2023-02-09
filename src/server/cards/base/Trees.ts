import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class Trees extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.TREES,
      tags: [Tag.PLANT],
      cost: 13,
      victoryPoints: 1,

      behavior: {
        production: {plants: 3},
        stock: {plants: 1},
      },

      requirements: CardRequirements.builder((b) => b.temperature(-4)),
      metadata: {
        cardNumber: '060',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.plants(3)).plants(1);
        }),
        description: 'Requires -4 C or warmer. Increase your plant production 3 steps. Gain 1 plant.',
      },
    });
  }
}
