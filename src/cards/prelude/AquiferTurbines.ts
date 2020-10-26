import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { Resources } from "../../Resources";
import { CardName } from "../../CardName";
import { PlaceOceanTile } from "../../deferredActions/PlaceOceanTile";

export class AquiferTurbines extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.ENERGY];
    public name: CardName = CardName.AQUIFER_TURBINES;
    public canPlay(player: Player, _game: Game, bonusMc?: number) {
        let requiredPayment = 3 - (bonusMc || 0);
        return requiredPayment <= 0 ? true : player.canAfford(requiredPayment);
    }
    public play(player: Player, game: Game) {
        player.addProduction(Resources.ENERGY, 2);
        player.megaCredits -= 3;
        game.defer(new PlaceOceanTile(player, game));
        return undefined;
    }
}

