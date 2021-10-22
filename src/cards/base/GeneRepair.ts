import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class GeneRepair extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.GENE_REPAIR,
      tags: [Tags.SCIENCE],
      cost: 12,
      victoryPoints: 2,

      requirements: CardRequirements.builder((b) => b.tag(Tags.SCIENCE, 3)),
      metadata: {
        cardNumber: '091',
        renderData: CardRenderer.builder((b) => b.production((pb) => pb.megacredits(2))),
        description: 'Requires 3 science tags. Increase your M€ production 2 steps.',
      },
    });
  }
  public play(player: Player) {
    if (player.getTagCount(Tags.SCIENCE) < 3) {
      throw 'Requires 3 science tags.';
    }
    player.addProduction(Resources.MEGACREDITS, 2);
    return undefined;
  }
}
