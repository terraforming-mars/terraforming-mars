import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { Resources } from "../../Resources";
import { CardName } from "../../CardName";
import { PlaceOceanTile } from "../../deferredActions/PlaceOceanTile";
import { SelectHowToPayDeferred } from "../../deferredActions/SelectHowToPayDeferred";

export class AquiferTurbines extends PreludeCard implements IProjectCard {
    public tags = [Tags.ENERGY];
    public name = CardName.AQUIFER_TURBINES;
    public canPlay(player: Player, _game: Game) {
        return player.canAfford(3);
    }
    public play(player: Player, game: Game) {
        player.addProduction(Resources.ENERGY, 2);
        game.defer(new PlaceOceanTile(player, game));
        game.defer(new SelectHowToPayDeferred(player, 3, false, false));
        return undefined;
    }
}

