import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {PartyName} from '../../turmoil/parties/PartyName';
import {Resources} from '../../Resources';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class PROffice extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.PR_OFFICE,
      tags: [Tags.EARTH],
      cost: 7,

      requirements: CardRequirements.builder((b) => b.party(PartyName.UNITY)),
      metadata: {
        cardNumber: 'T09',
        renderData: CardRenderer.builder((b) => {
          b.tr(1).br;
          b.megacredits(1).slash().earth().played;
        }),
        description: 'Requires that Unity are ruling or that you have 2 delegates there. Gain 1 TR. Gain 1 M€ for each Earth tag you have, including this.',
      },
    });
  }

  public canPlay(player: Player): boolean {
    if (!super.canPlay(player)) {
      return false;
    }
    if (PartyHooks.shouldApplyPolicy(player.game, PartyName.REDS)) {
      return player.canAfford(player.getCardCost(this) + REDS_RULING_POLICY_COST);
    }
    return true;
  }

  public play(player: Player) {
    player.increaseTerraformRating();
    const amount = player.getTagCount(Tags.EARTH) + 1;
    player.addResource(Resources.MEGACREDITS, amount);
    return undefined;
  }
}
