import {Tags} from '../../Tags';
import {Player} from '../../../Player';
import {PreludeCard} from '../../prelude/PreludeCard';
import {IProjectCard} from '../../IProjectCard';
import {CardName} from '../../../CardName';
import {Resources} from '../../../Resources';

export class TradeInfrastructure extends PreludeCard implements IProjectCard {
    public tags = [Tags.ENERGY];
    public name = CardName.TRADE_INFRASTRUCTURE;

    public play(player: Player) {
      player.addProduction(Resources.ENERGY);
      player.setResource(Resources.ENERGY, 3);
      player.increaseFleetSize();

      return undefined;
    }
}

