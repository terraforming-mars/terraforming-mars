import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { ISpace } from "../../ISpace";
import { SelectSpace } from "../../inputs/SelectSpace";

export class AquiferTurbines extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.ENERGY];
    public name: string = "Aquifer Turbines";
    public canPlay(player: Player) {
        return player.canAfford(3);
    }
    public play(player: Player, game: Game) {
        if (game.noOceansAvailable()) {
            player.energyProduction += 2;
            player.megaCredits -= 3;
            return undefined;
        }
        return new SelectSpace("Select space for ocean", game.getAvailableSpacesForOcean(player), (space: ISpace) => {
            game.addOceanTile(player, space.id);
            player.energyProduction += 2;
            player.megaCredits -= 3;
            return undefined;
        });
    }
}

