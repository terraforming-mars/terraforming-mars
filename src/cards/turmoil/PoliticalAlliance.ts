import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Tags} from '../Tags';
import {Card} from '../Card';

export class PoliticalAlliance extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.POLITICAL_ALLIANCE,
      cost: 4,
      tags: [Tags.MICROBE, Tags.SCIENCE],

      metadata: {
        cardNumber: 'X09',
        requirements: CardRequirements.builder((b) => b.partyLeaders(2)),
        renderData: CardRenderer.builder((b) => {
          b.tr(1);
        }),
        description: 'Requires that you have 2 party leaders. Gain 1 TR.',
      },
    });
  }
  public canPlay(player: Player): boolean {
    if (player.game.turmoil !== undefined) {
      const parties = player.game.turmoil.parties.filter((party) => party.partyLeader === player.id);
      const meetsPartyLeaderRequirements = parties.length > 1;

      if (PartyHooks.shouldApplyPolicy(player.game, PartyName.REDS)) {
        return player.canAfford(player.getCardCost(this) + REDS_RULING_POLICY_COST) && meetsPartyLeaderRequirements;
      }
      return meetsPartyLeaderRequirements;
    }
    return false;
  }

  public play(player: Player) {
    player.increaseTerraformRating();
    return undefined;
  }
}
