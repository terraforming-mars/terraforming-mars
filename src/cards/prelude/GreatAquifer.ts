import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { CardName } from "../../CardName";
import { PlaceOceanTile } from "../../deferredActions/PlaceOceanTile";

export class GreatAquifer extends PreludeCard implements IProjectCard {
    public tags = [];
    public name = CardName.GREAT_AQUIFER;

    public play(player: Player, game: Game) {
        game.defer(new PlaceOceanTile(player, game, "Select space for first ocean"));
        game.defer(new PlaceOceanTile(player, game, "Select space for second ocean"));
        return undefined;
    }
}

