import { Colony, IColony } from "./Colony";
import { Player } from "../Player";
import { PlayerInput } from "../PlayerInput";
import { Resources } from "../Resources";
import { ColonyName } from "./ColonyName";
import { Game } from "../Game";
import { LogHelper } from "../components/LogHelper";

export class Ganymede extends Colony implements IColony {
    public name = ColonyName.GANYMEDE;
    public description: string = "Plants";
    public trade(player: Player, game: Game, usesTradeFleet: boolean = true): void {
        if (usesTradeFleet) this.beforeTrade(this, player, game);

        const qty = this.trackPosition;
        player.plants += qty;
        LogHelper.logGainStandardResource(game, player, Resources.PLANTS, qty);
        
        if (usesTradeFleet) this.afterTrade(this, player, game);
    }
    public onColonyPlaced(player: Player, game: Game): undefined {
        super.addColony(this, player, game);
        player.addProduction(Resources.PLANTS);
        return undefined;
    }
    public giveTradeBonus(player: Player): undefined | PlayerInput {
        player.plants++;
        return undefined;
    }    
}
