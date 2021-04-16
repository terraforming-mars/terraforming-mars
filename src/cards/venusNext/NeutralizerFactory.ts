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

export class NeutralizerFactory extends Card {
  constructor() {
    super({
      name: CardName.NEUTRALIZER_FACTORY,
      cardType: CardType.AUTOMATED,
      tags: [Tags.VENUS],
      cost: 7,

      requirements: CardRequirements.builder((b) => b.venus(10)),
      metadata: {
        cardNumber: '240',
        renderData: CardRenderer.builder((b) => {
          b.venus(1);
        }),
        description: 'Requires Venus 10%. Increase the Venus track 1 step.',
      },
    });
  };

  public canPlay(player: Player): boolean {
    const globalRequirementsMet = super.canPlay(player);
    if (PartyHooks.shouldApplyPolicy(player.game, PartyName.REDS)) {
      return player.canAfford(player.getCardCost(this) + REDS_RULING_POLICY_COST, {floaters: true}) && globalRequirementsMet;
    }

    return globalRequirementsMet;
  }

  public play(player: Player) {
    player.game.increaseVenusScaleLevel(player, 1);
    return undefined;
  }
}
