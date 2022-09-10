import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class NoctisFarming extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.NOCTIS_FARMING,
      tags: [Tag.PLANT, Tag.BUILDING],
      cost: 10,
      requirements: CardRequirements.builder((b) => b.temperature(-20)),
      victoryPoints: 1,

      behavior: {
        production: {megacredits: 1},
        stock: {plants: 2},
      },

      metadata: {
        cardNumber: '176',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.megacredits(1);
          }).nbsp.plants(2);
        }),
        description: 'Requires -20 C or warmer. Increase your M€ production 1 step and gain 2 Plants.',
      },
    });
  }
}
