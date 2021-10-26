import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {digit} from '../Options';

export class MagneticShield extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.MAGNETIC_SHIELD,
      tags: [Tags.SPACE],
      cost: 24,
      tr: {tr: 4},

      requirements: CardRequirements.builder((b) => b.tag(Tags.ENERGY, 3)),
      metadata: {
        cardNumber: 'X24',
        renderData: CardRenderer.builder((b) => b.tr(4, {digit})),
        description: 'Requires 3 power tags. Raise your TR 4 steps.',
      },
    });
  }

  public play(player: Player) {
    player.increaseTerraformRatingSteps(4);
    return undefined;
  }
}
