import {IProjectCard} from '../IProjectCard';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class DiversitySupport extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.DIVERSITY_SUPPORT,
      tags: [],
      cost: 1,

      requirements: CardRequirements.builder((b) => b.resourceTypes(9)),
      metadata: {
        cardNumber: 'X20',
        description: 'Requires that you have 9 different types of resources. Gain 1 TR.',
        renderData: CardRenderer.builder((b) => b.tr(1)),
      },
    });
  }
  public play(player: Player) {
    player.increaseTerraformRating();
    return undefined;
  }
}
