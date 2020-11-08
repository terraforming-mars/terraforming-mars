import { Colony, IColony } from "./Colony";
import { Player } from "../Player";
import { PlayerInput } from "../PlayerInput";
import { Resources } from "../Resources";
import { Game } from "../Game";
import { ColonyName } from "./ColonyName";
import { LogHelper } from "../components/LogHelper";
import { IncreaseColonyTrack } from "../deferredActions/IncreaseColonyTrack";
import { PlaceOceanTile } from "../deferredActions/PlaceOceanTile";

export class Europa extends Colony implements IColony {
    public name = ColonyName.EUROPA;
    public description: string = "Production";
    public trade(player: Player, game: Game, usesTradeFleet: boolean = true): void {
        if (player.colonyTradeOffset && usesTradeFleet) {
            game.defer(new IncreaseColonyTrack(
                player,
                game,
                this,
                () => this.handleTrade(player, game, usesTradeFleet)
            ));
        } else {
            this.handleTrade(player, game, usesTradeFleet);
        }
    }

    private handleTrade(player: Player, game: Game, usesTradeFleet: boolean) {
        if (this.trackPosition < 2) {
            player.addProduction(Resources.MEGACREDITS);
            LogHelper.logGainProduction(game, player, Resources.MEGACREDITS);
        } else if (this.trackPosition < 4) {
            player.addProduction(Resources.ENERGY);
            LogHelper.logGainProduction(game, player, Resources.ENERGY);
        } else {
            player.addProduction(Resources.PLANTS);
            LogHelper.logGainProduction(game, player, Resources.PLANTS);
        }
        if (usesTradeFleet) this.afterTrade(this, player, game);
    }


    public onColonyPlaced(player: Player, game: Game): undefined {
        super.addColony(this, player, game);
        game.defer(new PlaceOceanTile(player, game, 'Select ocean for Europa colony'));
        return undefined;
    }
    public giveTradeBonus(player: Player): undefined | PlayerInput {
        player.megaCredits++;
        return undefined;
    }    
}
