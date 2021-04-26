import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class MagneticShield extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.MAGNETIC_SHIELD,
      tags: [Tags.SPACE],
      cost: 24,

      requirements: CardRequirements.builder((b) => b.tag(Tags.ENERGY, 3)),
      metadata: {
        cardNumber: 'X20',
        renderData: CardRenderer.builder((b) => b.tr(4).digit),
        description: 'Requires 3 power tags. Raise your TR 4 steps.',
      },
    });
  }

  public canPlay(player: Player): boolean {
    const hasEnergyTags = player.getTagCount(Tags.ENERGY) >= 3;
    if (PartyHooks.shouldApplyPolicy(player.game, PartyName.REDS)) {
      return player.canAfford(player.getCardCost(this) + REDS_RULING_POLICY_COST * 4, {titanium: true}) && hasEnergyTags;
    }

    return hasEnergyTags;
  }

  public play(player: Player) {
    player.increaseTerraformRatingSteps(4);
    return undefined;
  }
}
