
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class Farming extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.FARMING,
      tags: [Tag.PLANT],
      cost: 16,
      victoryPoints: 2,

      behavior: {
        production: {megacredits: 2, plants: 2},
        stock: {plants: 2},
      },

      requirements: CardRequirements.builder((b) => b.temperature(4)),
      metadata: {
        cardNumber: '118',
        description: 'Requires +4° C or warmer. Increase your M€ production 2 steps and your plant production 2 steps. Gain 2 plants.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.megacredits(2).br;
            pb.plants(2);
          }).nbsp.plants(2);
        }),
      },
    });
  }
}
