import {Colony, IColony} from './Colony';
import {Player} from '../Player';
import {PlayerInput} from '../PlayerInput';
import {ColonyName} from './ColonyName';
import {Resources} from '../Resources';
import {Game} from '../Game';
import {LogHelper} from '../components/LogHelper';

export class Ceres extends Colony implements IColony {
    public name = ColonyName.CERES;
    public description: string = 'Steel';
    public trade(player: Player, game: Game, usesTradeFleet: boolean = true): void {
      if (usesTradeFleet) this.beforeTrade(this, player, game);
      let qty : number;
      if (this.trackPosition === 2) {
        qty = 3;
      } else {
        qty = Math.max(this.trackPosition * 2 - 2, 2);
      }

      player.steel += qty;
      LogHelper.logGainStandardResource(game, player, Resources.STEEL, qty);
      if (usesTradeFleet) this.afterTrade(this, player, game);
    }
    public onColonyPlaced(player: Player, game: Game): undefined {
      super.addColony(this, player, game);
      player.addProduction(Resources.STEEL);
      return undefined;
    }
    public giveTradeBonus(player: Player): undefined | PlayerInput {
      player.steel += 2;
      return undefined;
    }
}
