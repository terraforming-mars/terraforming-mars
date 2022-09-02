import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {Resources} from '../../../common/Resources';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {max} from '../Options';

export class ArchaeBacteria extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.ARCHAEBACTERIA,
      tags: [Tag.MICROBE],
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
    player.production.add(Resources.PLANTS, 1);
    return undefined;
  }
}
