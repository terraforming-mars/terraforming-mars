import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { Resources } from "../../Resources";
import { CardName } from "../../CardName";
import { PlaceOceanTile } from "../../deferredActions/PlaceOceanTile";

export class PolarIndustries extends PreludeCard implements IProjectCard {
    public tags = [Tags.STEEL];
    public name = CardName.POLAR_INDUSTRIES;
    public play(player: Player, game: Game) {
        game.defer(new PlaceOceanTile(player, game));
        player.addProduction(Resources.HEAT, 2);
        return undefined;
    }
}
