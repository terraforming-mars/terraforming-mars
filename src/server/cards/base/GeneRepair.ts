import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class GeneRepair extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.GENE_REPAIR,
      tags: [Tag.SCIENCE],
      cost: 12,
      victoryPoints: 2,

      behavior: {
        production: {megacredits: 2},
      },

      requirements: CardRequirements.builder((b) => b.tag(Tag.SCIENCE, 3)),
      metadata: {
        cardNumber: '091',
        renderData: CardRenderer.builder((b) => b.production((pb) => pb.megacredits(2))),
        description: 'Requires 3 science tags. Increase your M€ production 2 steps.',
      },
    });
  }
}
