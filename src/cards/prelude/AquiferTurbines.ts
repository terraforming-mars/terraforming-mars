import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { ISpace } from "../../ISpace";
import { SelectSpace } from "../../inputs/SelectSpace";
import { Resources } from '../../Resources';

export class AquiferTurbines extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.ENERGY];
    public name: string = "Aquifer Turbines";
    public canPlay(player: Player) {
        return player.canAfford(3);
    }
    public play(player: Player, game: Game) {
        if (game.noOceansAvailable()) {
            player.setProduction(Resources.ENERGY,2);
            player.megaCredits -= 3;
            return undefined;
        }
        return new SelectSpace("Select space for ocean", game.board.getAvailableSpacesForOcean(player), (space: ISpace) => {
            game.addOceanTile(player, space.id);
            player.setProduction(Resources.ENERGY,2);
            player.megaCredits -= 3;
            return undefined;
        });
    }
}

