import { Colony, IColony } from "./Colony";
import { Player } from "../Player";
import { PlayerInput } from "../PlayerInput";
import { ColonyName } from "./ColonyName";
import { Resources } from "../Resources";
import { Game } from "../Game";
import { LogHelper } from "../components/LogHelper";

export class Io extends Colony implements IColony {
    public name = ColonyName.IO;
    public description: string = "Heat";
    public trade(player: Player, game: Game, usesTradeFleet: boolean = true): void {
        if (usesTradeFleet) this.beforeTrade(this, player, game);
        
        let qty : number;
        if (this.trackPosition === 1 || this.trackPosition === 6) {
            qty = (this.trackPosition * 2) + 1;
        } else {
            qty = (this.trackPosition * 2);
        }
        
        player.heat += qty;
        LogHelper.logGainStandardResource(game, player, Resources.HEAT, qty);
        if (usesTradeFleet) this.afterTrade(this, player, game);
    }
    public onColonyPlaced(player: Player, game: Game): undefined {
        super.addColony(this, player, game);
        player.addProduction(Resources.HEAT);
        return undefined;
    }
    public giveTradeBonus(player: Player): undefined | PlayerInput {
        player.heat += 2;
        return undefined;
    }    
}
