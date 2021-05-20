import {IProjectCard} from '../IProjectCard';
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

export class SpinInducingAsteroid extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.SPIN_INDUCING_ASTEROID,
      cost: 16,
      tags: [Tags.SPACE],

      requirements: CardRequirements.builder((b) => b.venus(10).max()),
      metadata: {
        cardNumber: '246',
        renderData: CardRenderer.builder((b) => {
          b.venus(2);
        }),
        description: 'Venus must be 10% or lower. Raise Venus 2 steps.',
      },
    });
  }

  public canPlay(player: Player): boolean {
    if (!super.canPlay(player)) {
      return false;
    }

    if (PartyHooks.shouldApplyPolicy(player.game, PartyName.REDS)) {
      return player.canAfford(player.getCardCost(this) + REDS_RULING_POLICY_COST * 2, {titanium: true});
    }

    return true;
  }

  public play(player: Player) {
    player.game.increaseVenusScaleLevel(player, 2);
    return undefined;
  }
}
