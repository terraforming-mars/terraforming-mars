import {Colony, IColony} from './Colony';
import {Player} from '../Player';
import {PlayerInput} from '../PlayerInput';
import {Resources} from '../Resources';
import {ColonyName} from './ColonyName';
import {Game} from '../Game';
import {LogHelper} from '../components/LogHelper';

export class Callisto extends Colony implements IColony {
    public name = ColonyName.CALLISTO;
    public description: string = 'Energy';
    public trade(player: Player, game: Game, usesTradeFleet: boolean = true): void {
      if (usesTradeFleet) this.beforeTrade(this, player, game);

      const qty = Math.max(2, (2 * this.trackPosition) -1 + Math.max(this.trackPosition - 4, 0));
      player.energy += qty;
      LogHelper.logGainStandardResource(game, player, Resources.ENERGY, qty);

      if (usesTradeFleet) this.afterTrade(this, player, game);
    }
    public onColonyPlaced(player: Player, game: Game): undefined {
      super.addColony(this, player, game);
      player.addProduction(Resources.ENERGY);
      return undefined;
    }
    public giveTradeBonus(player: Player): undefined | PlayerInput {
      player.energy += 3;
      return undefined;
    }
}
