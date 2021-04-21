import {Player} from '../../../Player';
import {CardName} from '../../../CardName';
import {CardRenderer} from '../../render/CardRenderer';
import {REDS_RULING_POLICY_COST} from '../../../constants';
import {StandardProjectCard} from '../../StandardProjectCard';
import {PartyHooks} from '../../../turmoil/parties/PartyHooks';
import {PartyName} from '../../../turmoil/parties/PartyName';
import * as constants from '../../../constants';

export class AsteroidStandardProject extends StandardProjectCard {
  constructor() {
    super({
      name: CardName.ASTEROID_STANDARD_PROJECT,
      cost: 14,
      metadata: {
        cardNumber: 'SP9',
        renderData: CardRenderer.builder((b) =>
          b.standardProject('Spend 14 M€ to raise temperature 1 step.', (eb) => {
            eb.megacredits(14).startAction.temperature(1);
          }),
        ),
      },
    });
  }

  public canAct(player: Player): boolean {
    let asteroidCost = this.cost;
    if (PartyHooks.shouldApplyPolicy(player.game, PartyName.REDS)) asteroidCost += REDS_RULING_POLICY_COST;

    return player.canAfford(asteroidCost) && player.game.getTemperature() < constants.MAX_TEMPERATURE;
  }

  actionEssence(player: Player): void {
    player.game.increaseTemperature(player, 1);
  }
}
