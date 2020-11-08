import { Colony, IColony } from "../../colonies/Colony";
import { Player } from "../../Player";
import { PlayerInput } from "../../PlayerInput";
import { Game } from "../../Game";
import { ColonyName } from "../../colonies/ColonyName";
import { Tags } from "../Tags";
import { AddResourcesToCard } from "../../deferredActions/AddResourcesToCard";

export class Venus extends Colony implements IColony {
    public name = ColonyName.VENUS;
    public isActive = false;
    public description: string = "Venus";

    public trade(player: Player, game: Game, usesTradeFleet: boolean = true): void {
        if (usesTradeFleet) {
            this.beforeTrade(this, player, game);
        }

        if (this.trackPosition >= 3) {
            const qty = this.trackPosition - 2;
            game.defer(new AddResourcesToCard(player, game, undefined, qty, Tags.VENUS, "Select Venus card to add " + qty + " resource(s)"));
        }

        if (usesTradeFleet) {
            this.afterTrade(this, player, game);
        }
    }

    public onColonyPlaced(player: Player, game: Game): undefined {
        super.addColony(this, player, game);
        game.increaseVenusScaleLevel(player, 1);
        return undefined;
    }
    
    public giveTradeBonus(player: Player, game: Game): undefined | PlayerInput {
        return (new AddResourcesToCard(player, game, undefined, 1, Tags.VENUS, "Select Venus card to add 1 resource")).execute();
    }   
}
