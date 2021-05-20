import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class PoliticalAlliance extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.POLITICAL_ALLIANCE,
      cost: 4,

      requirements: CardRequirements.builder((b) => b.partyLeaders(2)),
      metadata: {
        cardNumber: 'X09',
        renderData: CardRenderer.builder((b) => {
          b.tr(1);
        }),
        description: 'Requires that you have 2 party leaders. Gain 1 TR.',
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
    return undefined;
  }
}
