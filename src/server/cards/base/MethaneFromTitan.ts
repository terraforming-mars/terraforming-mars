import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';

export class MethaneFromTitan extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.METHANE_FROM_TITAN,
      tags: [Tag.JOVIAN, Tag.SPACE],
      cost: 28,
      victoryPoints: 2,

      behavior: {
        production: {heat: 2, plants: 2},
      },

      requirements: CardRequirements.builder((b) => b.oxygen(2)),
      metadata: {
        description: 'Requires 2% oxygen. Increase your heat production 2 steps and your plant production 2 steps.',
        cardNumber: '018',
        renderData: CardRenderer.builder((b) => b.production((pb) => {
          pb.heat(2).br;
          pb.plants(2);
        })),
      },
    });
  }
}
