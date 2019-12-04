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

