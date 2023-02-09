import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class KelpFarming extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.KELP_FARMING,
      tags: [Tag.PLANT],
      cost: 17,
      victoryPoints: 1,

      behavior: {
        production: {megacredits: 2, plants: 3},
        stock: {plants: 2},
      },

      requirements: CardRequirements.builder((b) => b.oceans(6)),
      metadata: {
        cardNumber: '055',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.megacredits(2).br;
            pb.plants(3);
          }).nbsp.plants(2);
        }),
        description: 'Requires 6 ocean tiles. Increase your M€ production 2 steps and your plant production 3 steps. Gain 2 plants.',
      },
    });
  }
}
