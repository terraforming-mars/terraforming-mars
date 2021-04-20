import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {StandardProjectCard} from '../StandardProjectCard';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import * as constants from '../../constants';

export class AirScrappingStandardProject extends StandardProjectCard {
  constructor() {
    super({
      name: CardName.AIR_SCRAPPING_STANDARD_PROJECT,
      cost: 15,
      metadata: {
        cardNumber: 'SP1',
        renderData: CardRenderer.builder((b) =>
          b.standardProject('Spend 15 M€ to raise Venus 1 step.', (eb) => {
            eb.megacredits(15).startAction.venus(1);
          }),
        ),
      },
    });
  }

  public canAct(player: Player): boolean {
    let cost = this.cost;
    if (PartyHooks.shouldApplyPolicy(player.game, PartyName.REDS)) cost += REDS_RULING_POLICY_COST;

    return player.canAfford(cost) && player.game.getVenusScaleLevel() < constants.MAX_VENUS_SCALE;
  }

  actionEssence(player: Player): void {
    player.game.increaseVenusScaleLevel(player, 1);
  }
}
