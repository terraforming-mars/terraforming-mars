import {IPlayer} from '../../../IPlayer';
import {CardName} from '../../../../common/cards/CardName';
import {CardRenderer} from '../../render/CardRenderer';
import {StandardProjectCard} from '../../StandardProjectCard';
import * as constants from '../../../../common/constants';

export class AsteroidStandardProject extends StandardProjectCard {
  constructor() {
    super({
      name: CardName.ASTEROID_STANDARD_PROJECT,
      cost: 14,
      tr: {temperature: 1},
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

  public override canPayWith(player: IPlayer) {
    if (player.isCorporation(CardName.KUIPER_COOPERATIVE)) {
      return {kuiperAsteroids: true};
    } else {
      return {};
    }
  }

  public override canAct(player: IPlayer): boolean {
    if (player.game.getTemperature() === constants.MAX_TEMPERATURE) {
      return false;
    }
    return super.canAct(player);
  }

  actionEssence(player: IPlayer): void {
    player.game.increaseTemperature(player, 1);
  }
}
