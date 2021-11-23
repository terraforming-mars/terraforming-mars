import {StandardActionCard} from '../../StandardActionCard';
import {CardName} from '../../../CardName';
import {CardRenderer} from '../../render/CardRenderer';
import {Player} from '../../../Player';
import {HEAT_FOR_TEMPERATURE, MAX_TEMPERATURE} from '../../../constants';
import {Units} from '../../../Units';


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

    // Strictly speaking, this conditional is not necessary, because canAfford manages reserveUnits.
    if (player.availableHeat < HEAT_FOR_TEMPERATURE) {
      return false;
    }

    return player.canAfford(0, {
      tr: {temperature: 1},
      reserveUnits: Units.of({heat: 8}),
    });
  }

  public action(player: Player) {
    return player.spendHeat(HEAT_FOR_TEMPERATURE, () => {
      this.actionUsed(player);
      player.game.increaseTemperature(player, 1);
      return undefined;
    });
  }
}
