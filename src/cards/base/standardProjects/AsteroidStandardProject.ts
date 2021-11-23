import {Player} from '../../../Player';
import {CardName} from '../../../CardName';
import {CardRenderer} from '../../render/CardRenderer';
import {StandardProjectCard} from '../../StandardProjectCard';
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
    if (player.game.getTemperature() === constants.MAX_TEMPERATURE) {
      return false;
    };
    return player.canAfford(this.cost, {
      tr: {temperature: 1},
    });
  }

  actionEssence(player: Player): void {
    player.game.increaseTemperature(player, 1);
  }
}
