import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { ISpace } from "../../ISpace";
import { SelectSpace } from "../../inputs/SelectSpace";

export class GreatAquifer extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [];
    public name: string = "Great Aquifer";
    public text: string = "Place 2 ocean tiles.";
    public requirements: undefined;
    public description: string = "We found a big one !";
    public play(player: Player, game: Game) {
        return new SelectSpace("Select space for first ocean tile", game.getAvailableSpacesForOcean(player), (space: ISpace) => {
            game.addOceanTile(player, space.id);
            
            return new SelectSpace("Select space for second ocean tile", game.getAvailableSpacesForOcean(player), (space: ISpace) => {
                game.addOceanTile(player, space.id);
                return undefined;
            });
        });

    }
}

