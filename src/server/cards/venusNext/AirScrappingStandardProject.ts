import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {StandardProjectCard} from '../StandardProjectCard';
import * as constants from '../../../common/constants';
import {TRSource} from '../../../common/cards/TRSource';

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

  public override getTRSources(_player: IPlayer): TRSource {
    return {venus: 1}
  }

  public override canAct(player: IPlayer): boolean {
    if (player.game.getVenusScaleLevel() >= constants.MAX_VENUS_SCALE) {
      this.warnings.add('maxvenus');
    }
    return super.canAct(player);
  }

  actionEssence(player: IPlayer): void {
    player.game.increaseVenusScaleLevel(player, 1);
  }
}
