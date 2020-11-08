import { Colony, IColony } from "./Colony";
import { Player } from "../Player";
import { PlayerInput } from "../PlayerInput";
import { ColonyName } from "./ColonyName";
import { Game } from "../Game";
import { ResourceType } from "../ResourceType";
import { AddResourcesToCard } from "../deferredActions/AddResourcesToCard";

export class Enceladus extends Colony implements IColony {
    public name = ColonyName.ENCELADUS;
    public description: string = "Microbes";
    public isActive = false;
    public resourceType = ResourceType.MICROBE;
    public trade(player: Player, game: Game, usesTradeFleet: boolean = true): void {
        if (usesTradeFleet) this.beforeTrade(this, player, game);
        let microbes: number = 0;
        if (this.trackPosition > 4) {
            microbes = this.trackPosition - 1;
        } else {
            microbes = this.trackPosition;
        }
        game.defer(new AddResourcesToCard(player, game, ResourceType.MICROBE, microbes));
        if (usesTradeFleet) this.afterTrade(this, player, game);
    }
    public onColonyPlaced(player: Player, game: Game): undefined {
        super.addColony(this, player, game);
        game.defer(new AddResourcesToCard(player, game, ResourceType.MICROBE, 3));
        return undefined;
    }
    public giveTradeBonus(player: Player, game: Game): undefined | PlayerInput {
        return (new AddResourcesToCard(player, game, ResourceType.MICROBE, 1)).execute();
    }    
}
