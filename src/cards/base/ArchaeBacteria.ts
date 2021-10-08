import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {max} from '../Options';

export class ArchaeBacteria extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.ARCHAEBACTERIA,
      tags: [Tags.MICROBE],
      cost: 6,

      requirements: CardRequirements.builder((b) => b.temperature(-18, {max})),
      metadata: {
        description: 'It must be -18 C or colder. Increase your Plant production 1 step.',
        cardNumber: '042',
        renderData: CardRenderer.builder((b) => b.production((pb) => pb.plants(1))),
      },
    });
  }
  public play(player: Player) {
    player.addProduction(Resources.PLANTS, 1);
    return undefined;
  }
}
