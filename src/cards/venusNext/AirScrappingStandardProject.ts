import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {StandardProjectCard} from '../StandardProjectCard';
import * as constants from '../../constants';

export class AirScrappingStandardProject extends StandardProjectCard {
  constructor(properties = {
    name: CardName.AIR_SCRAPPING_STANDARD_PROJECT,
    cost: 15,
    tr: {venus: 1},
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
    return super.canAct(player);
  }

  actionEssence(player: Player): void {
    player.game.increaseVenusScaleLevel(player, 1);
  }
}
