import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {StandardProjectCard} from '../StandardProjectCard';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import * as constants from '../../constants';

export class AirScrappingStandardProject extends StandardProjectCard {
  constructor(properties = {
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
  }) {
    super(properties);
  }

  public canAct(player: Player): boolean {
    if (player.game.getVenusScaleLevel() >= constants.MAX_VENUS_SCALE) return false;
    let cost = this.cost;
    cost -= this.discount(player);
    if (PartyHooks.shouldApplyPolicy(player, PartyName.REDS)) cost += REDS_RULING_POLICY_COST;
    return player.canAfford(cost);
  }

  actionEssence(player: Player): void {
    player.game.increaseVenusScaleLevel(player, 1);
  }
}
