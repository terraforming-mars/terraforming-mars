import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {MAX_VENUS_SCALE, REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class GiantSolarShade extends Card {
  constructor() {
    super({
      name: CardName.GIANT_SOLAR_SHADE,
      cardType: CardType.AUTOMATED,
      tags: [Tags.SPACE, Tags.VENUS],
      cost: 27,

      metadata: {
        cardNumber: '229',
        renderData: CardRenderer.builder((b) => b.venus(3)),
        description: 'Raise Venus 3 steps.',
      },
    });
  };

  public canPlay(player: Player): boolean {
    const remainingVenusSteps = (MAX_VENUS_SCALE - player.game.getVenusScaleLevel()) / 2;
    const stepsRaised = Math.min(remainingVenusSteps, 3);

    if (PartyHooks.shouldApplyPolicy(player.game, PartyName.REDS)) {
      return player.canAfford(player.getCardCost(this) + REDS_RULING_POLICY_COST * stepsRaised, {titanium: true, floaters: true});
    }

    return true;
  }

  public play(player: Player) {
    return player.game.increaseVenusScaleLevel(player, 3);
  }
}

