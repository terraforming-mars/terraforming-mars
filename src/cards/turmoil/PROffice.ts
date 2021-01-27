import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {PartyName} from '../../turmoil/parties/PartyName';
import {Resources} from '../../Resources';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class PROffice extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 7,
      tags: [Tags.EARTH],
      name: CardName.PR_OFFICE,
      cardType: CardType.AUTOMATED,

      metadata: {
        cardNumber: 'T09',
        requirements: CardRequirements.builder((b) => b.party(PartyName.UNITY)),
        renderData: CardRenderer.builder((b) => {
          b.tr(1).br;
          b.megacredits(1).slash().earth().played;
        }),
        description: 'Requires that Unity are ruling or that you have 2 delegates there. Gain 1 TR. Gain 1 MC for each Earth tag you have, including this.',
      },
    });
  }

  public canPlay(player: Player): boolean {
    if (player.game.turmoil !== undefined) {
      const meetsPartyRequirements = player.game.turmoil.canPlay(player, PartyName.UNITY);
      if (PartyHooks.shouldApplyPolicy(player.game, PartyName.REDS)) {
        return player.canAfford(player.getCardCost(this) + REDS_RULING_POLICY_COST) && meetsPartyRequirements;
      }

      return meetsPartyRequirements;
    }
    return false;
  }

  public play(player: Player) {
    player.increaseTerraformRating();
    const amount = player.getTagCount(Tags.EARTH) + 1;
    player.setResource(Resources.MEGACREDITS, amount);
    return undefined;
  }
}
