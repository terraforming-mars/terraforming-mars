import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { ISpace } from "../../ISpace";
import { SelectSpace } from "../../inputs/SelectSpace";
import { Resources } from '../../Resources';

export class PolarIndustries extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = "Polar Industries";
    public play(player: Player, game: Game) {
        if (game.noOceansAvailable()) {
            player.heatProduction += 2;
            return undefined;
        }
        return new SelectSpace("Select space for ocean", game.getAvailableSpacesForOcean(player), (space: ISpace) => {
            game.addOceanTile(player, space.id);
            player.setProduction(Resources.HEAT,2);
            return undefined;
        });
    }
}

