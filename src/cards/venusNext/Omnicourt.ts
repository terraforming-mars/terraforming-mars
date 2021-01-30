import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class Omnicourt extends Card {
  constructor() {
    super({
      name: CardName.OMNICOURT,
      cardType: CardType.AUTOMATED,
      tags: [Tags.BUILDING],
      cost: 11,

      metadata: {
        cardNumber: '241',
        requirements: CardRequirements.builder((b) => b.tag(Tags.VENUS).tag(Tags.EARTH).tag(Tags.JOVIAN)),
        renderData: CardRenderer.builder((b) => {
          b.tr(2);
        }),
        description: 'Requires Venus, Earth and Jovian tags. Increase your TR 2 steps.',
      },
    });
  };

  public canPlay(player: Player): boolean {
    const hasRequiredTags = player.checkMultipleTagPresence([Tags.VENUS, Tags.EARTH, Tags.JOVIAN]);
    if (PartyHooks.shouldApplyPolicy(player.game, PartyName.REDS)) {
      return player.canAfford(player.getCardCost(this) + REDS_RULING_POLICY_COST * 2, true) && hasRequiredTags;
    }

    return hasRequiredTags;
  }

  public play(player: Player) {
    player.increaseTerraformRatingSteps(2);
    return undefined;
  }
}
