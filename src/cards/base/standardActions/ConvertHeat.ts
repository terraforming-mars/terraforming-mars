import {StandardActionCard} from '../../StandardActionCard';
import {CardName} from '../../../CardName';
import {CardRenderer} from '../../render/CardRenderer';
import {Player} from '../../../Player';
import {PartyHooks} from '../../../turmoil/parties/PartyHooks';
import {PartyName} from '../../../turmoil/parties/PartyName';
import {HEAT_FOR_TEMPERATURE, MAX_TEMPERATURE, REDS_RULING_POLICY_COST} from '../../../constants';


export class ConvertHeat extends StandardActionCard {
  constructor() {
    super({
      name: CardName.CONVERT_HEAT,
      metadata: {
        cardNumber: 'SA2',
        renderData: CardRenderer.builder((b) =>
          b.standardProject('Spend 8 Heat to raise temperature 1 step.', (eb) => {
            eb.heat(8).startAction.temperature(1);
          }),
        ),
      },
    });
  }

  public canAct(player: Player): boolean {
    if (player.game.getTemperature() === MAX_TEMPERATURE) {
      return false;
    }
    if (player.availableHeat < HEAT_FOR_TEMPERATURE) {
      return false;
    }

    if (PartyHooks.shouldApplyPolicy(player.game, PartyName.REDS)) {
      return (!player.isCorporation(CardName.HELION) && player.canAfford(REDS_RULING_POLICY_COST)) ||
        player.canAfford(REDS_RULING_POLICY_COST + 8);
    }
    return true;
  }

  public action(player: Player) {
    return player.spendHeat(HEAT_FOR_TEMPERATURE, () => {
      this.actionUsed(player);
      player.game.increaseTemperature(player, 1);
      return undefined;
    });
  }
}
