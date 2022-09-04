import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {Resources} from '../../../common/Resources';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class TerraformingContract extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.TERRAFORMING_CONTRACT,
      cost: 8,
      tags: [Tag.EARTH],

      requirements: CardRequirements.builder((b) => b.tr(25)),
      metadata: {
        cardNumber: '252',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(4));
        }),
        description: 'Requires that you have at least 25 TR. Increase your M€ production 4 steps.',
      },
    });
  }
  public override bespokePlay(player: Player) {
    player.production.add(Resources.MEGACREDITS, 4);
    return undefined;
  }
}
